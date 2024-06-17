function initSliderNumberPair(target, targetField, pair, helper = null) {
    if (pair.length != 2) console.error(pair + " contains more than 2 elements");
    else {
        pair[0].onchange = function() {
            target[targetField] = pair[0].value;
            pair[1].value = pair[0].value;
            if (helper != null) helper.update();
        };
        pair[1].onchange = function() {
            target[targetField] = pair[1].value;
            pair[0].value = pair[1].value;
            if (helper != null) helper.update();
        };
    }
}

function initSpotlightControls(spotlight, spotlightHelper, spotlightBrightness, spotlightCoordinates) {
    for (const input of spotlightBrightness) input.value = spotlight.intensity;
    initSliderNumberPair(spotlight, "intensity", spotlightBrightness);

    for (const input of spotlightCoordinates) {
        if (input.classList.contains('x')) input.value = spotlight.position.x;
        if (input.classList.contains('y')) input.value = spotlight.position.y;
        if (input.classList.contains('z')) input.value = spotlight.position.z;
    }
    for (const c of ['x', 'y', 'z']) {
        const coordinateControls = new Array();
        for (const i of spotlightCoordinates) if (i.classList.contains(c)) coordinateControls.push(i);
        initSliderNumberPair(spotlight.position, c, coordinateControls, spotlightHelper);
    }
}

function initAmbientControls(ambient, ambientBrightness, ambientColour) {
    for (const input of ambientBrightness) input.value = ambient.intensity
    initSliderNumberPair(ambient, "intensity", ambientBrightness);

    ambientColour[0].value = '#' + ambient.color.getHex().toString(16);
    ambientColour[0].onchange = function() {
        ambient.color.set(ambientColour[0].value);
    }
}