import EventEmitter from "./services/eventEmitter.js";
import Game from "./model/Game.js";
import Controller from "./Controller.js";
import View from "./view/View.js";
import { CONSTANTS } from "./constants/game.js";
import AudioPlayer from "./view/AudioPlayer.js";
import CanvasRenderer from "./view/CanvasRenderer.js";

const appEvents = new EventEmitter();
const audioPlayer = new AudioPlayer();
const canvasRenderer = new CanvasRenderer({ appEvents, CONSTANTS });

const view = View.create({ appEvents, CONSTANTS, audioPlayer, canvasRenderer });
const game = Game.create({ appEvents, CONSTANTS });

Controller.create({ appEvents, view, game, CONSTANTS });