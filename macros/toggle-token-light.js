
function tokenUpdate(data, active = true) {
    let targets = canvas.tokens.controlled;
    for( let i = 0; i < targets.length; i++) {
        targets[i].document.update(data);
        targets[i].actor?.toggleStatusEffect("torch", { active: active, overlay: false })
    }
}

let torchAnimation = {"type": "torch", "speed": 1, "intensity": 1, "reverse": false};

let noAnimation = {"type": "none", "speed": 5, "intensity": 5, "reverse": false};

let dialogEditor = new Dialog({
    title: `Token Light Picker`,
    content: `Pick the light source the selected token is holding.`,
    buttons: {
        none: {
            label: `None`,
            callback: () => {
                tokenUpdate({"light.dim": 0, "light.bright": 0, "light.angle": 360, "light.color":"#ffffff" }, false);
                dialogEditor.render(true);
            }
        },
        torch: {
            label: `Torch`,
            callback: () => {
                tokenUpdate({"light.dim": 2, "light.bright": 5, "light.angle": 360, "light.luminosity": 0.5, "light.animation": torchAnimation, "light.color" : "#ffad58"});
                dialogEditor.render(true);
            }
        },
        lamp: {
            label: `Lantern`,
            callback: () => {
                tokenUpdate({"light.dim": 2, "light.bright": 10, "light.angle": 360, "light.luminosity": 0.5, "light.animation": torchAnimation, "light.color" : "#eccd8b"});
                dialogEditor.render(true);
            }
        },
        sunrod: {
            label: `Sunrod / Delvers Light`,
            callback: () => {
                tokenUpdate({"light.dim": 2, "light.bright": 20, "light.angle": 360, "light.luminosity": 0.6, "light.animation": torchAnimation, "light.color" : "#eccd8b"});
                dialogEditor.render(true);
            }
        },
        delverDim: {
            label: `Delvers Light Dim`,
            callback: () => {
                tokenUpdate({"light.dim": 20, "light.bright": 1, "light.angle": 360, "light.luminosity": 0.6, "light.animation": torchAnimation, "light.color" : "#eccd8b"});
                dialogEditor.render(true);
            }
        },
        candle: {
            label: `Candle`,
            callback: () => {
                tokenUpdate({"light.dim": 2, "light.bright": 0, "light.angle": 360, "light.luminosity": 0.5, "light.animation": torchAnimation, "light.color" : "#ffad58"});
                dialogEditor.render(true);
            }
        },
        glowbug: {
            label: `Jar of Glowbugs`,
            callback: () => {
                tokenUpdate({"light.dim": 0.5, "light.bright": 0, "light.angle": 360, "light.luminosity": 0.3, "light.animation": torchAnimation, "light.color" : "#4dd569"});
                dialogEditor.render(true);
            }
        },
        close: {
            icon: "<i class='fas fa-tick'></i>",
            label: `Close`
        },
    },
    default: "close",
    close: () => {}
});

dialogEditor.render(true)