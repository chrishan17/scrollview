/* globals define */
define(function(require, exports, module) {
    'use strict';
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Scrollview = require('famous/views/Scrollview');
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Timer = require('famous/utilities/Timer');
    var Easing = require('famous/transitions/Easing');
    var Deck = require('famous/views/Deck');
    var GridLayout = require('famous/views/GridLayout');
    var Transitionable = require('famous/transitions/Transitionable');

    var SpringTransition = require('famous/transitions/SpringTransition');
    Transitionable.registerMethod('spring', SpringTransition);

    // create the main context
    var mainContext = Engine.createContext();

    mainContext.setPerspective(1000);

    var scrollview = new Scrollview({
        direction: 0,
        // pageDamp: 0.5,
        // paginated: true,
        // pageSwitchSpeed: 2
    });
    var containers = []
    scrollview.sequenceFrom(containers);

    var modifiers = [];
    var logos = [];
    for (var i = 0; i < 100; i++) {
        var surfaces = [];
        var logo = new Deck({
            itemSpacing: 10,
            transition: {
                method: 'spring',
                period: 300,
                dampingRatio: 0.5
            },
            stackRotation: 0.02
        });

        logo.sequenceFrom(surfaces);
        logos.push(logo);

        for (var j = 0; j < i % 3 + 1; j++) {
            var temp = new ImageSurface({
                size: [100, 150],
                content: '/content/images/show.jpg',
                classes: ['reflect'],
            });
            surfaces.push(temp);
        }

        var centerSpinModifier = new Modifier({
            origin: [.5, .5]
        });

        var container = new ContainerSurface({
            size: [150, 150],
        });

        container.pipe(scrollview);

        modifiers.push(centerSpinModifier);

        container.add(centerSpinModifier).add(logo);
        containers.push(container);
    };

    containers.forEach(function(surface, index) {
        surface.on('click', function() {
            logos[index].toggle();
        });
    })

    modifiers[0].setTransform(Transform.scale(1.5, 1.5, 1.5), {
        duration: 1000,
        curve: Easing.outBack
    });

    scrollview.on('pageChange', function() {
        var n = scrollview.getCurrentIndex();
        var v = scrollview.getVelocity();
        if (n + 1 < 100) {
            if (v > 0) {
                modifiers[n].setTransform(Transform.scale(1, 1, 1), {
                    duration: 500,
                    curve: Easing.outBack
                });
                modifiers[n].setTransform(Transform.rotateY(1), {
                    duration: 500,
                    curve: Easing.inQuad
                });
                modifiers[n + 1].setTransform(Transform.scale(1.5, 1.5, 1.5), {
                    duration: 500,
                    curve: Easing.outBack
                });
            } else {
                modifiers[n].setTransform(Transform.scale(1.5, 1.5, 1.5), {
                    duration: 500,
                    curve: Easing.outBack
                });
                modifiers[n + 1].setTransform(Transform.rotateY(-1), {
                    duration: 500,
                    curve: Easing.inQuad
                });
                modifiers[n + 1].setTransform(Transform.scale(1, 1, 1), {
                    duration: 500,
                    curve: Easing.outBack
                });
            }
        }
    });

    mainContext.add(new Modifier({
        origin: [0.3, 0.35]
    })).add(scrollview);

    function setModifier(index, scale, rotate) {
        if (arguments.length === 2) {
            modifiers[index].setTransform(Transform.scale(scale, scale, scale), {
                duration: 500,
                curve: Easing.outBack
            });
        } else {
            modifiers[index].setTransform(Transform.rotateY(rotate), {
                duration: 500,
                curve: Easing.outBack
            });
        }
    }

});