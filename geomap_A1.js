
(function() { 
//iife - this wraps the code in a function so it isn't accidentally exposed 
//to other javascript in other files. It is not required.

    var width=800, height=600

    //read in our json file
    d3.json("./topo.json").then((data) => { //I renamed the topojson file

        /***
         * Create a mapping to convert lat/long into pixels. 
         * There are many ways to generate map projections. 
         * We largely take them for granted at this point. 
         * Below, we use Albers projection of the US. 
         * The scale indicates the zoom level. 
         * Note the projection will generate a D3 path (SVG lines). 
         * We then plot these lines roughly the same we would with a linegraph.
         * ****/
        var projection = d3.geoAlbersUsa().scale(700).translate([487.5, 305])
        var path = d3.geoPath(projection);

        //One final thing we need to do is preprocess our data to get the topo features:
        const topo = topojson.feature(data, data.objects.states)

        //Great, now let’s create our map!
        const svg = d3.select("#geomap_A1").append('g').attr('transform', 'translate(50,50)');

        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path)
            .attr("fill", 'whitesmoke')
            .attr("stroke", "black")
            .attr("stroke-width", "1px");
    });
})();
