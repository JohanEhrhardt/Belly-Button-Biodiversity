function init() {

    var selector = d3.select("#selDataset");
  

    d3.json("samples.json").then((data) => {
      var sampleNames = data.names;
  
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  

      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  

  init();
  
  function optionChanged(newSample) {

    buildMetadata(newSample);
    buildCharts(newSample);
  }
  

  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;

      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];

      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
  
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
    });
  }
  

  function buildCharts(sample) {

    d3.json("samples.json").then((data) => {
      
      var samples = data.samples;
   
      var resultArray = samples.filter(sampleObj => sampleObj.id == sample); 
  
      var Result = resultArray[0];
      
      var otuID = Result.otu_ids;
      var otuLabel = Result.otu_labels;
      console.log(otuLabel);
      var sampleValue = Result.sample_values.map((value) => parseInt(value));
      
      var yticks = otuID.slice(0,10).map((id) => "OTU " + id).reverse();
     

      var barData = {
        x: sampleValue.slice(0,10).reverse(),
        y: yticks,
        hoverinfo: otuLabel,
        type: "bar",
        orientation: "h",
        backgroundColor: "rgb(192, 189, 189)"
      };

      var barLayout = {
        title: {
          text: "<b>Top 10 Bacteria Cultures Found</b>",
          y: 0.90
        },
        margin: {
          l: 100,
          r: 35,
          b: 50,
          t: 75,
          pad: 4
        },
      };

      Plotly.newPlot("bar", [barData], barLayout);
  
  // ---------------------------------------------------------------------------------------
  
      var bubbleData = {
        x: otuID,
        y: sampleValue,
        type: "bubble",
        text: otuLabel,
        hoverinfo: "x+y+text",
        mode: "markers",
        marker: {size: sampleValue, color: otuID, colorscale: "Earth"}
      };

      var bubbleLayout = {
        title: {
          text: "<b>Bacteria Cultures Per Sample</b>",
          y:0.95,
        },
        xaxis: {title: "OTU ID"},
        margin: {
          l: 75,
          r: 50,
          b: 60,
          t: 60,
          pad: 10
        },
        hovermode: "closest"
      };

      Plotly.newPlot("bubble", [bubbleData], bubbleLayout);
  
      //-----------------------------------------------------------------------------------
      
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var Result = resultArray[0];
      var wFreq = parseFloat(Result.wfreq);
      var gaugeData = {
        type: "indicator",
        value: wFreq,
        mode: "gauge+number",
        gauge: {
          axis: {range: [0,10], dtick: 2},
          bar: {color: "black"},
          steps: [
            {range: [0,2], color: "red"},
            {range: [2,4], color: "orange"},
            {range: [4,6], color: "yellow"},
            {range: [6,8], color: "yellowgreen"},
            {range: [8,10], color: "green"}
          ],
        }
      };   

      var gaugeLayout = { 
        title: {
          text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
          y: 0.75,
        },
        margin: {
          l: 50,
          r: 50,
          b: 0,
          t: 50,
          pad: 50
        },
      };

      Plotly.newPlot("gauge", [gaugeData], gaugeLayout);
    });
  }