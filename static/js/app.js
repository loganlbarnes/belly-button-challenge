const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

d3.json(url).then(function(data) {
    console.log(data);
});

// Initialize the dashboard at start up
function init() {
    
    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        
        let names = data.names;
        
        // Add samples to dropdown menu
        names.forEach((id) => {
            console.log(id);
            dropdown.append("option").text(id).property("value",id);
        });

        // Set the first sample from the list
        let one = names[0];
        console.log(one);

        // Build the initial charts
        info(one);
        bar(one);
        bubble(one);
    });
};

// fill the demographic info panel
function info(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Get metadata
        let metadata = data.metadata;

        let value = metadata.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Clear metadata
        d3.select("#sample-metadata").html("");

        // Add pairs to the demographic info panel
        Object.entries(valueData).forEach(([key,value]) => {
            console.log(key,value);
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};

// make bar chart
function bar(sample) {

    d3.json(url).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        Plotly.newPlot("bar",[trace])
    });
};

// make bubble chart
function bubble(sample) {

    d3.json(url).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        console.log(otu_ids,otu_labels,sample_values);
        
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            }
        };

        let layout = {
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// update dashboard when user selects different value
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    info(value);
    bar(value);
    bubble(value);
};

// Call the initialize function
init();