var margin = { top: 50, right: 0, bottom: 100, left: 50 },
    width = 1000- margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 8),
    legendElementWidth = gridSize*2,
    rounding = 2,
    buckets = 10,
    colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"],
    Hair = ["Black", "Brown", "Red", "Blond"],
    Eye =["Brown", "Blue","Hazel","Green"],
    Sex = ["Female","Male"];
datasets = ["HairEyeColor.csv"],
    hair_pos = {"Black":0,"Brown":1,"Red":2,"Blond":3},
    eye_pos = {"Brown":0,"Blue":1,"Hazel":2,"Green":3},
    sex_pos = {"Female":0,"Male":gridSize/2};

var chart = d3.select("body").append("div").attr("id","#chart");

var svg = chart.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var HairLabels = svg.selectAll(".HairLabel")
    .data(Hair)
    .enter().append("text")
    .text(function (d) { return d; })
    .attr("x", 0)
    .attr("y", function (d, i) { return i * gridSize; })
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + gridSize/2 + ")")
    .attr("class", function (d, i) { return "HairLabel mono axis axis-hair"; });

var EyeLabels = svg.selectAll(".EyeLabel")
    .data(Eye)
    .enter().append("text")
    .text(function(d) { return d; })
    .attr("x", 2)
    .attr("y", function (d, i) { return gridSize/2 + i * gridSize; })
    .style("text-anchor", "")
    .attr("transform", "translate(0,"+ gridSize/2 + ")")
    .attr("transform", "rotate(-90)")
    .attr("class", function(d, i) { return "EyeLabel mono axis axis-eye"; });



d3.csv("HairEyeColor.csv",
    function(d) {
        return {
            Eye:   d.Eye,
            Hair:  d.Hair,
            Sex:   d.Sex,
            Freq: +d.Freq
        };
    },
    function(error, data) {
        var colorScale = d3.scale.quantile()
            .domain([0, buckets - 1, d3.max(data, function (d) {
                return d.Freq;
            })])
            .range(colors);

        var cards = svg.selectAll(".Freq")
            .data(data)
            .enter().append("rect")
            .attr("x", function (d) {
                return (hair_pos[d.Hair] * gridSize) + sex_pos[d.Sex];
            })
            .attr("y", function (d) {
                return (eye_pos[d.Eye] * gridSize);
            })
            .attr("rx", rounding)
            .attr("ry", rounding)
            .attr("width", gridSize / 2)
            .attr("height", gridSize)
            .style("stroke", "black")
            .style("fill", colors[0]);

        cards.transition().duration(1000)
            .style("fill", function (d) {
                return colorScale(d.Freq);
            });
        //
        // cards.select("title").text(function(d) { return d.Hair; });

        cards.exit().remove();

        var legend = svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function (d) {
                return d;
            });

        legend.enter().append("g")
            .attr("class", "legend");

        legend.append("rect")
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function (d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr("class", "mono")
            .text(function (d) {
                return "≥ " + Math.round(d);
            })
            .attr("x", function (d, i) {
                return legendElementWidth * i;
            })
            .attr("y", height + gridSize);

        legend.exit().remove();

        var camera, scene, renderer;
        var controls;
        var objects = [];
        var targets = { sphere: []};
        init();
        animate();
        function init() {
            camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.z = 3000;
            scene = new THREE.Scene();

        }
        var button = document.getElementById( 'sphere' );
        button.addEventListener( 'click', function () {
            transform( targets.sphere, 2000 );
        }, false );

        var vector = new THREE.Vector3();
        for ( var i = 0, l = objects.length; i < l; i ++ ) {
            var phi = Math.acos( - 1 + ( 2 * i ) / l );
            var theta = Math.sqrt( l * Math.PI ) * phi;
            var object = new THREE.Object3D();
            object.position.setFromSphericalCoords( 800, phi, theta );
            vector.copy( object.position ).multiplyScalar( 2 );
            object.lookAt( vector );
            targets.sphere.push( object );
        }


    });//var z = x(4, 3);