let _ = require('lodash');
let d3 = require('d3');
let $ = require('jquery');

module.exports = {
    speedCamerasLine: function(callback){
        let height = 700;
        let width = 900;
        let margin = {top: 100, right: 275, bottom: 225, left: 60};

        d3.select('#svg0').attr('height', Number(height + margin.top + margin.bottom))
                        .attr('width', Number(width + margin.left + margin.right));

        $.getJSON('http://localhost:8080/speedCameras.json', datafile=>{
            // datafile is an array of objects {month, series, fine}

            let g = d3.select('#svg0').append('svg').attr("id", "plotCitations")
                    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
                let dt = null;

            _.forEach(datafile, citation=>{
                dt = new Date(citation.datetime);
                citation.datetime = new Date(dt.getFullYear(), dt.getMonth(), 1)
            });

            let chartData = _.groupBy(datafile, "datetime");
            _.forEach(chartData, (count, dt)=>{chartData[dt] = count.length;});
            chartData = _.forEach(_.toPairs(chartData), array=>{array[0] = new Date(array[0])});
            chartData = _.sortBy(chartData, value=>{
                return value[0];
            });

            // remove values with no valid date
            chartData = new Date(chartData[0][0]) < new Date("2000-01-01") ? _.tail(chartData) : chartData;

            let xDomain = d3.extent(chartData, d=>{return d[0];});
            let yDomain = [0, _.chain(chartData).map(a=>{return a[1];}).max().multiply(1.05).round(-2).value()];
            
            // scales
            let xScale = d3.scaleTime().range([0, width]).domain(xDomain);
            let yScale = d3.scaleLinear().range([height, 0]).domain(yDomain);

            // background color
            g.append("rect").attr("width", width).attr("height", height).style("fill", "#DFDFDF");

            // axes
            d3.select("#plotCitations").append("g").attr("transform", "translate(0, " + height + ")")
                .call(d3.axisBottom(xScale));
            
            d3.select("#svg0").append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
                .call(d3.axisLeft(yScale));

            // gridlines
            d3.select("#plotCitations").append("g").attr('class', 'grid')
                .call(d3.axisLeft(yScale).tickSize(-width).tickFormat(''));
            d3.selectAll('.grid').style('stroke', '#BCBCBC').style('stroke-width', '1px').style('stroke-opacity', 0.7);

            let line = d3.line().x(d=>{return xScale(d[0]);}).y(d=>{return yScale(d[1]);})

            // data
            // array: [{month, series, [valueOfCurrentseries, sumOfPreviousseriess] 
            g.append('path').datum(chartData)
                .attr('fill', 'none')
                .attr('class', 'line')
                .attr('id', 'speedCameraLine')
                .style('stroke', 'steelblue').style('stroke-width', '5px')
                .attr('d', line);

            g.selectAll('circle').data(chartData).enter().append('circle')
                .attr('cx', d=>{return xScale(d[0]);})
                .attr('cy', d=>{return yScale(d[1]);})
                .attr('r', 5)
                .style('fill', 'steelblue')
                .style('stroke-width', 1)
                .style('stroke', 'black');
                
            g.selectAll('.vtext').data(chartData).enter().append('text')
                .attr('class', 'vtext')
                .attr('x', d=>{return xScale(d[0]);})
                .attr('y', d=>{return yScale(d[1]);})
                .text(d=>{return d[1];})
                .style('text-anchor', 'middle');

            // legend
            // d3.select('#svg0').selectAll('.legend').data(colorDomain).enter().append('text')
            //     .attr('class', 'legend')
            //     .attr('x', Number(_.add(width, margin.left) + 15))
            //     .attr('y', (d, i)=>{return Number(_.add(margin.top, 15) + i*15);})
            //     .text(d=>{return d;})
            //     .style('fill', d=>{return colorScale(d);});
            
            // title
            d3.select('#svg0').append('text')
                .attr("x", _.add(margin.left, width/2))
                .attr("y", margin.top/2)
                .text('Baltimore City Speed Camera Violations by Date')
                .style('font-size', '24px').style('text-align', 'center').style('text-anchor', 'middle').style('dominant-baseline', 'central');
            
            callback();

        });
    }
    
}

