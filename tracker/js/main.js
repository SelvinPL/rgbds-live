import createRgbAsm from '../../rgbds/rgbasm';
import createRgbLink from '../../rgbds/rgblink';
import createRgbFix from '../../rgbds/rgbfix';

import Song from './song.js';
import Player from './player.js';
import InstrumentUI from './ui/instruments.js';
import TrackerUI from './ui/tracker.js';
import SequenceUI from './ui/sequence.js';

import SdccExporter from './sdccExport.js'
import AssemblyExporter from './assemblyExport.js'

import * as ugeSaver from './ugeSaver.js'
import * as ugeLoader from './ugeLoader.js'


globalThis.song = new Song();
song.createDefaults();
globalThis.ui = {};
globalThis.player = null;

export function init(event) {
    document.getElementById('playButton').onclick = (event) => {
        player.play();
    };
    document.getElementById('stopButton').onclick = (event) => {
        player.stop();
    };
    document.getElementById('downloadHttButton').onclick = (event) => {
        new AssemblyExporter().downloadHttZip();
    };
    document.getElementById('downloadSdccButton').onclick = (event) => {
        var code = new SdccExporter().getCCode();

        var element = document.createElement('a');
        var url = window.URL.createObjectURL(new Blob([code], { type: 'application/octet-stream' }));
        element.setAttribute('href', url);
        element.setAttribute('download', 'song.c');

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        window.URL.revokeObjectURL(url);
    };
    document.getElementById('downloadUgeButton').onclick = (event) => {
        ugeSaver.saveUge(song);
    };

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
        document.body.addEventListener(
        eventName,
        (e) => {
            e.preventDefault();
            e.stopPropagation();
        },
        false,
        );
    });
    document.body.addEventListener(
        'drop',
        (e) => {
        e.dataTransfer.files[0].arrayBuffer().then((data) => {
            globalThis.song = ugeLoader.loadUGESong(data);
            console.log(song);
            ui.tracker.loadPattern(0);
            ui.sequence.update();
            ui.instruments.updateInstrumentList();
        });
        },
        false,
    );

    player = new Player();
    ui.instruments = new InstrumentUI();
    ui.tracker = new TrackerUI();
    ui.sequence = new SequenceUI();
}