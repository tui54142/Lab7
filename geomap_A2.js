(function () {
    //iife - this wraps the code in a function so it isn't accidentally exposed 
    //to other javascript in other files. It is not required.

    var width = 800, height = 600

    Promise.all([
        d3.json("./topo.json"),
        d3.csv("./cities.csv"),
        d3.csv("./states.csv")
    ]).then((data) => {
        console.log(data);

        //give our data sensible names
        const topology = data[0];
        const cities = data[1];
        const statesData = data[2];

        //create a dictionary for states and populations
        const stateDictionary = new Map();
        statesData.forEach((state) => {
            stateDictionary.set(state.State, +state.Population) //note: I renamed it in file
            console.log(state.State)
            console.log(state.Population)
        })

        var blues = d3.scaleSequential()
            .domain(d3.extent(stateDictionary.values()))
            .range(["white", "steelblue"]);

        var projection = d3.geoAlbersUsa().scale(700).translate([487.5, 305])
        var path = d3.geoPath(projection);

        //One final thing we need to do is preprocess our data to get the topo features:
        const topo = topojson.feature(topology, topology.objects.states)

        //Great, now let’s create our map!
        const svg = d3.select("#geomap_A2").append('g').attr('transform', 'translate(50,50)');

        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
            .attr("d", path)
            .attr("fill", function (d) { return blues(stateDictionary.get(d.properties.name)) })
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

        //making circles
        svg.selectAll("circle")
            .data(cities)
            .join("circle")
            .attr("stroke", "dark red")
            .attr('cx', (d) => { return projection([d.longitude, d.latitude])[0] })
            .attr('cy', (d) => { return projection([d.longitude, d.latitude])[1] })
            .attr("r", "4")
            .attr("fill", "red");

    });
})();