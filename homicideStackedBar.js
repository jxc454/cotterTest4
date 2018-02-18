let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

module.exports = {
    homicideStackedBar: function(callback){
        let height = 700;
        let width = 1400;
        let margin = {top: 100, right: 275, bottom: 225, left: 60};

        d3.select('#svg0').attr('height', Number(height + margin.top + margin.bottom))
                        .attr('width', Number(width + margin.left + margin.right));

        $.getJSON('http://localhost:8080/homicideData.json', datafile=>{
            // datafile is an array of objects {month, series, fine}

            let g = d3.select('#svg0').append('svg').attr("id", "plotCitations")
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

            let acc = 0;
            
            let chartData = [];
            let xDomain = _.uniq(_.map(datafile, 'month')).sort();
            let byMonthData = _.groupBy(datafile, 'month');
            let yDomain = [0, _.max(_.map(byMonthData, monthdata=>{return monthdata.length;}))*1.025];
            let colorDomain = _.uniq(_.map(datafile, 'series')).sort();
            let byMonthForChart = _.keyBy(xDomain);
            
            // scales
            let xScale = d3.scaleBand().range([0, width]).domain(xDomain.sort((a, b)=>{return +a-b;})).padding(0.1);
            let yScale = d3.scaleLinear().range([height, 0]).domain(yDomain);
            let colorScale = d3.scaleOrdinal().range(d3.schemeCategory20).domain(colorDomain);

            // create a template object with entries for every month/series combination
            _.forEach(byMonthForChart, (val, key)=>{byMonthForChart[key] = _.mapKeys(colorDomain);});

            // get the actual data by month and series
            _.forEach(byMonthData, (monthdata, month)=>{
                byMonthData[month] = _.groupBy(monthdata, 'series')
            });

            // merge the actual data into the template
            _.forEach(colorDomain, series=>{
                _.forEach(xDomain, month=>{
                    _.set(byMonthForChart, '[' + month + '][' + series + ']', _.has(byMonthData, [month, series]) ? byMonthData[month][series] : null);
                });
            });

            // create the "cumulative" array for the chart
            _.forEach(byMonthForChart, (monthdata, month)=>{
                acc = 0;
                _.forEach(monthdata, (seriess, series)=>{
                    if (seriess) {
                        chartData.push({"month": month, "series": series, "values": [seriess.length, acc]});
                        acc += seriess.length;
                    }
                })
            });

            // background color
            g.append("rect").attr("width", width).attr("height", height).style("fill", "#DFDFDF");

            // axes
            d3.select("#plotCitations").append("g").attr("transform", "translate(0, " + height + ")")
                .call(d3.axisBottom(xScale))
                    .selectAll("text")
                        .attr("y", 0)
                        .attr("x", 9)
                        .attr("dy", ".35em")
                        .attr("transform", "rotate(90)")
                        .style("text-anchor", "start");
            
            d3.select("#svg0").append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(d3.axisLeft(yScale));

            // gridlines
            d3.select("#plotCitations").append("g").attr('class', 'grid')
                .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
            d3.selectAll('.grid').style('stroke', '#BCBCBC').style('stroke-width', '1px').style('stroke-opacity', 0.7);

            // data
            // array: [{month, series, [valueOfCurrentseries, sumOfPreviousseriess] 
            g.selectAll('.bar').data(chartData).enter().append('rect')
                .attr('class', 'bar')
                .attr('id', d=>{return d.month + d.series;})
                .attr('x', d=>{return xScale(d.month);})
                .attr('y', d=>{return yScale(d.values[1] + d.values[0]);})
                .attr('width', width/xDomain.length*0.95)
                .attr('height', d=>{return height - yScale(d.values[0]);})
                .style('fill', d=>{return colorScale(d.series);});

            // legend
            d3.select('#svg0').selectAll('.legend').data(colorDomain).enter().append('text')
                .attr('class', 'legend')
                .attr('x', Number(_.add(width, margin.left) + 15))
                .attr('y', (d, i)=>{return Number(_.add(margin.top, 15) + i*15);})
                .text(d=>{return d;})
                .style('fill', d=>{return colorScale(d);});
            
            // title
            d3.select('#svg0').append('text')
                .attr("x", _.add(margin.left, width/2))
                .attr("y", margin.top/2)
                .text('Baltimore Homicides')
                .style('font-size', '24px').style('text-align', 'center').style('text-anchor', 'middle').style('dominant-baseline', 'central');
            
            callback();

        });
    }
    
}

