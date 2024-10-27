// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.filter(meta => meta.id === parseInt(sample))[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use .html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key}: ${value}`);
    });
  });
}


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const result = samples.filter(sampleData => sampleData.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = result.otu_ids;
    const otu_labels = result.otu_labels;
    const sample_values = result.sample_values;

    // Build a Bubble Chart
    const bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth',
      }
    };

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Number of Bacteria' },
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const yticks = otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const topSampleValues = sample_values.slice(0, 10).reverse();
    const topOtuLabels = otu_labels.slice(0, 10).reverse();

    // Build a Bar Chart
    const barTrace = {
      x: topSampleValues,
      y: yticks,
      text: topOtuLabels,
      type: 'bar',
      orientation: 'h'
    };

    const barLayout = {
      title: 'Top 10 OTUs Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: 'OTU IDs' }
    };

    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the names field
    const sampleNames = data.names; 
    sampleNames.forEach(sample => {
      d3.select("#selDataset") 
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    

    // Use d3 to select the dropdown 
    const dropdown = d3.select("#sample-select");

    // Use the list of sample names to populate the select options
    sampleNames.forEach(name => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Get the first sample from the list
    const firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();

