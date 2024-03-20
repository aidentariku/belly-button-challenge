// Function to initialize the webpage
function initialize() {
  // Select the dropdown element
  let dropdown = d3.select("#selDataset");

  // Read the data from the JSON file using D3
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    // Populate the dropdown with sample names
    sampleNames.forEach((sample) => {
      dropdown.append("option").text(sample).property("value", sample);
    });

    // Display plots and demographic information for the first sample
    updatePlots(sampleNames[0]);
    displayMetadata(sampleNames[0]);
  });
}

// Function to create plots
function updatePlots(sample) {
  d3.json("samples.json").then((data) => {
    let samples = data.samples;
    let result = samples.find((sampleObj) => sampleObj.id === sample);

    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    // Create a bar chart
    let barData = [{
      y: otuIds.slice(0, 10).map((otuID) => `OTU ${otuID}`).reverse(),
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Create a bubble chart
    let bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
    }];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to display metadata
function displayMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    let result = metadata.find((sampleObj) => sampleObj.id === sample);

    let panel = d3.select("#sample-metadata");
    panel.html("");

    // Display metadata in the panel
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Function to handle dropdown selection change
function optionChanged(newSample) {
  updatePlots(newSample);
  displayMetadata(newSample);
}

// Initialize the webpage
initialize();
