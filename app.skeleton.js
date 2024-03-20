function initialize() {
  let selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector.append("option")
              .text(sample)
              .property("value", sample);
    });

    let firstSample = sampleNames[0];
    buildPlots(firstSample);
    displayMetadata(firstSample);
  });
}

function buildPlots(sample) {
  d3.json("samples.json").then((data) => {
    let samples = data.samples;
    let result = samples.find((sampleObj) => sampleObj.id == sample);

    let otuIds = result.otu_ids;
    let otuLabels = result.otu_labels;
    let sampleValues = result.sample_values;

    let yTicks = otuIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    let barData = [{
      y: yTicks,
      x: sampleValues.slice(0, 10).reverse(),
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };

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

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

function displayMetadata(sample) {
  d3.json("samples.json").then((data) => {
    let metadata = data.metadata;
    
    let result = metadata.find((sampleObj) => sampleObj.id == sample);
    
    let panel = d3.select("#sample-metadata");
    panel.html("");

    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

function optionChanged(newSample) {
  buildPlots(newSample);
  displayMetadata(newSample);
}

// Initialize
initialize();
