function main() {

  var activityDictionary = {
    2:"Lowest",
    3:"Low",
    4:"Moderate",
    5:"High",
    6:"Highest"
  }
	
	var map = new L.Map('map', { 
      center: [40.7127,-74.0059],
      zoom: 11,
    });

  // Put layer data into a JS object
  var layerSource_injuries = {
  user_name: 'dmarulli',
  type: 'cartodb',
  sublayers: [{ 
    sql: "SELECT * FROM full_crash_yearly_w_activity WHERE pedinjurie >= 2 AND yr >= 2014",
    cartocss: $("#full_crash_yearly_w_activity_css").text(),
    interactivity: "pedinjurie"
  }]
};

  var layerSource_activity = {
  user_name: 'dmarulli',
  type: 'cartodb',
  sublayers: [{
    sql: "SELECT * FROM nbt_nta",
    cartocss: $("#nbt_nta_css").text()
  }]
};

var layerSource_street_design = {
  user_name: 'dmarulli',
  type: 'cartodb',
  sublayers: [{
    sql: "SELECT * FROM speed_bumps_2014",
    cartocss: "#speed_bumps_2014{ line-color: #081B47; line-width: 2; line-opacity: 0.5; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM safe_streets_for_seniors_1",
    cartocss: "#safe_streets_for_seniors_1{ polygon-fill: #081B47; polygon-opacity: 0.5; line-width: 0; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM street_improvement_projects_2013_2014_intersections",
    cartocss: "#street_improvement_projects_2013_2014_intersections{ marker-fill-opacity: 0.5; marker-line-width: 0; marker-width: 5; marker-fill: #081B47; marker-allow-overlap: true; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM street_improvement_projects_2013_2014_corridors",
    cartocss: "#street_improvement_projects_2013_2014_corridors{ line-color: #081B47; line-width: 2; line-opacity: 0.5; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM arterial_slow_zones",
    cartocss: "#arterial_slow_zones{ line-color: #081B47; line-width: 2; line-opacity: 0.5; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM leading_pedestrian_interval_signals",
    cartocss: "#leading_pedestrian_interval_signals{ marker-fill-opacity: 0.5; marker-line-width: 0; marker-width: 5; marker-fill: #081B47; marker-allow-overlap: true; }"//,
    //interactivity: "intervention_type"
  },
  {
    sql: "SELECT * FROM neighborhood_slow_zones",
    cartocss: "#neighborhood_slow_zones{ polygon-fill: #081B47; polygon-opacity: 0.5; line-width: 0; }"//,
    //interactivity: "intervention_type"
  }]
};

// var layerSource_pi = {
//   user_name: 'dmarulli',
//   type: 'cartodb',
//   sublayers: [{
//     sql: "SELECT * FROM pi_si_geod",
//     cartocss: "#pi_si_geod{ marker-fill-opacity: 0.75; marker-width: 5; marker-line-width: 0; marker-fill: #A53ED5; }"
//   },
//   {
//     sql: "SELECT * FROM pi_mn_geod",
//     cartocss: "#pi_mn_geod{ marker-fill-opacity: 0.75; marker-width: 5; marker-line-width: 0; marker-fill: #A53ED5; }"
//   },
//   {
//     sql: "SELECT * FROM pi_qn_geod",
//     cartocss: "#pi_qn_geod{ marker-fill-opacity: 0.75; marker-width: 5; marker-line-width: 0; marker-fill: #A53ED5; }"
//   },
//   {
//     sql: "SELECT * FROM pi_bk_geod",
//     cartocss: "#pi_bk_geod{ marker-fill-opacity: 0.75; marker-width: 5; marker-line-width: 0; marker-fill: #A53ED5; }"
//   },
//   {
//     sql: "SELECT * FROM pi_bx_geod",
//     cartocss: "#pi_bx_geod{ marker-fill-opacity: 0.75; marker-width: 5; marker-line-width: 0; marker-fill: #A53ED5; }"
//   }]
// };


    

  // For storing the sublayers
  var sublayers = [];
  var sublayers_design = []

  // Pull tiles from OpenStreetMap
  L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

  // Add data layers to map
  cartodb.createLayer(map,layerSource_activity)
    .addTo(map, 0)
    .done(function(layer) {
      // do stuff
    });

  // cartodb.createLayer(map,layerSource_pi)
  //   .addTo(map, 3)
  //   .done(function(layer) {
  //     // do stuff
  //     layer.hide();
  //       $("#priority_locations_toggle").on('click', function() {
  //         layer.toggle()
  //       })
        
  //   });

  cartodb.createLayer(map,layerSource_street_design)
      .addTo(map, 2)
      .done(function(layer) {
        // do stuff
        // for (var i = 0; i < layer.getSubLayerCount(); i++) {
        // sublayers_design[i] = layer.getSubLayer(i);
        // cartodb.vis.Vis.addInfowindow(map, sublayers_design[i], ['intervention_type']);
      // };
        layer.hide();
        $("#street_design_toggle").on('click', function() {
          layer.toggle()
        })
        
      });

    
  
  cartodb.createLayer(map,layerSource_injuries)
    .addTo(map, 1)
    .done(function(layer) {

      for (var i = 0; i < layer.getSubLayerCount(); i++) {
        sublayers[i] = layer.getSubLayer(i);
      };

      //sublayers[0].hide()

      sublayers[0].setInteraction(true)
      sublayers[0].on('featureClick', function(e, latlng, pos, data) {
          console.log(latlng)
          
          var panorama;
          panorama = new google.maps.StreetViewPanorama(
            document.getElementById('street_view'),
            {
              position: {lat: latlng[0], lng: latlng[1]},
              pov: {heading: 165, pitch: 0},
              zoom: 1
            });
      });

      $(function() {
  $( "#injurySlider" ).slider({
    range: "max",
    value: 2, // would be better if programatic
    min: 1, // would be better if programatic
    max: 19, // would be better if programatic
    slide: function( event, ui ) {
      $( "#injuryAmount" ).val(ui.value);
      min_injuries = ui.value
      min_year = $( "#yearSlider" ).slider( "value" )
      max_activity = $( "#activitySlider" ).slider( "value" )
      query = "SELECT * FROM full_crash_yearly_w_activity WHERE (yr >= " + min_year + " AND pedinjurie >= " + min_injuries+ "AND pl_cg <= " + max_activity + ")";
      sublayers[0].setSQL(query);
    }
  });
  $( "#injuryAmount" ).val( $( "#injurySlider" ).slider( "value" ));
});

    $(function() {
  $( "#yearSlider" ).slider({
    range: "max",
    value: 2014, // would be better if programatic
    min: 2009, // would be better if programatic
    max: 2015, // would be better if programatic
    slide: function( event, ui ) {
      $( "#yearAmount" ).val(ui.value);
      min_year = ui.value
      min_injuries = $( "#injurySlider" ).slider( "value" )
      max_activity = $( "#activitySlider" ).slider( "value" )
      query = "SELECT * FROM full_crash_yearly_w_activity WHERE (yr >= " + min_year + " AND pedinjurie >= " + min_injuries+ "AND pl_cg <= " + max_activity + ")";
      sublayers[0].setSQL(query);
    }
  });
  $( "#yearAmount" ).val( $( "#yearSlider" ).slider( "value" ));
});
    $(function() {
  $( "#activitySlider" ).slider({
    range: "min",
    value: 6, // would be better if programatic
    min: 2, // would be better if programatic
    max: 6, // would be better if programatic
    slide: function( event, ui ) {
      $( "#activityAmount" ).val(activityDictionary[ui.value]);
      max_activity = ui.value
      min_year = $( "#yearSlider" ).slider( "value" )
      min_injuries = $( "#injurySlider" ).slider( "value" )
      query = "SELECT * FROM full_crash_yearly_w_activity WHERE (yr >= " + min_year + " AND pedinjurie >= " + min_injuries + "AND pl_cg <= " + max_activity + ")";
      sublayers[0].setSQL(query);
    }
  });
  $( "#activityAmount" ).val( activityDictionary[$( "#activitySlider" ).slider( "value" )]);
});

      
    })
    .error(function(err) {
      console.log("error: " + err);
    });
    
}