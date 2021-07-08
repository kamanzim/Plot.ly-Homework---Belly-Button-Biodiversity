//Building a function to read json file using d3
function buildMetaData(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

  // Filtering the data
  var buildingArray = metadata.filter(sampleObj => sampleObj.id == sample);
  var result = buildingArray[0];
  // Using d3 to select the required panel
  var paneldata = d3.select("#sample-metadata");

  // Clearing the existing data in the html
  paneldata.html("");

  // Using "Object.entries" to add each key and value pair to paneldata
  Object.entries(result).forEach(([key, value]) => {
    paneldata.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });
});
}

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var sampledata = data.samples;
    var buildingArray = sampledata.filter(sample_object => sample_object.id == sample);
    var result = buildingArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Building Bubble Chart
  var bubblechart = {
      title: "Bacteria Cultures Per Sample",
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
    };
    var bubbledata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbledata, bubblechart);
    
    //Creating a horizontal bar chart
    var y_ticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var bardata = [
      {
        y: y_ticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];

    var chartlayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", bardata, chartlayout);
  });
};

function init() {
  // Grabbing a reference to the dropdown element
  var select_dropdown = d3.select("#selDataset");

  // Populating the select options by using the list of sample names
  d3.json("samples.json").then((data) => {
    var name = data.names;

    name.forEach((sample) => {
      select_dropdown
        .append("option")
        .text(sample)
        .property("value", sample);
    })

    // Using the sample data from the list to build the plots
    var sample_data = name[0];
    buildCharts(sample_data);
    buildMetaData(sample_data);
  });
};

function optionChanged(new_sample) {
  // Fetching new data each time a new sample is selected
  buildCharts(new_sample);
  buildMetaData(new_sample);
}


// Initializing dashboard
init()