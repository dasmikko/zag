"use strict";

var _xstate = require("xstate");

const {
  actions, createMachine
} = _xstate;
  
const { choose } = actions;
const fetchMachine = createMachine({
  id: "slider",
  initial: "unknown",
  activities: ["trackFormReset", "trackScriptedUpdate"],
  on: {
    SET_VALUE: {
      actions: "setValue"
    },
    INCREMENT: {
      actions: "increment"
    },
    DECREMENT: {
      actions: "decrement"
    }
  },
  states: {
    unknown: {
      on: {
        SETUP: {
          target: "idle",
          actions: ["setupDocument", "setThumbSize", "checkValue"]
        }
      }
    },
    idle: {
      on: {
        POINTER_DOWN: {
          target: "dragging",
          actions: ["setPointerValue", "invokeOnChangeStart", "focusThumb"]
        },
        FOCUS: "focus"
      }
    },
    focus: {
      entry: "focusThumb",
      on: {
        POINTER_DOWN: {
          target: "dragging",
          actions: ["setPointerValue", "invokeOnChangeStart", "focusThumb"]
        },
        ARROW_LEFT: {
          cond: "isHorizontal",
          actions: "decrement"
        },
        ARROW_RIGHT: {
          cond: "isHorizontal",
          actions: "increment"
        },
        ARROW_UP: {
          cond: "isVertical",
          actions: "increment"
        },
        ARROW_DOWN: {
          cond: "isVertical",
          actions: "decrement"
        },
        PAGE_UP: {
          actions: "increment"
        },
        PAGE_DOWN: {
          actions: "decrement"
        },
        HOME: {
          actions: "setToMin"
        },
        END: {
          actions: "setToMax"
        },
        BLUR: "idle"
      }
    },
    dragging: {
      entry: "focusThumb",
      activities: "trackPointerMove",
      on: {
        POINTER_UP: {
          target: "focus",
          actions: "invokeOnChangeEnd"
        },
        POINTER_MOVE: {
          actions: "setPointerValue"
        }
      }
    }
  }
})