/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@dnd-kit/accessibility/dist/accessibility.esm.js":
/*!***********************************************************************!*\
  !*** ./node_modules/@dnd-kit/accessibility/dist/accessibility.esm.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HiddenText": () => (/* binding */ HiddenText),
/* harmony export */   "LiveRegion": () => (/* binding */ LiveRegion),
/* harmony export */   "useAnnouncement": () => (/* binding */ useAnnouncement)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


const hiddenStyles = {
  display: 'none'
};
function HiddenText(_ref) {
  let {
    id,
    value
  } = _ref;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: id,
    style: hiddenStyles
  }, value);
}

const visuallyHidden = {
  position: 'fixed',
  width: 1,
  height: 1,
  margin: -1,
  border: 0,
  padding: 0,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(100%)',
  whiteSpace: 'nowrap'
};
function LiveRegion(_ref) {
  let {
    id,
    announcement
  } = _ref;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    id: id,
    style: visuallyHidden,
    role: "status",
    "aria-live": "assertive",
    "aria-atomic": true
  }, announcement);
}

function useAnnouncement() {
  const [announcement, setAnnouncement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const announce = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(value => {
    if (value != null) {
      setAnnouncement(value);
    }
  }, []);
  return {
    announce,
    announcement
  };
}


//# sourceMappingURL=accessibility.esm.js.map


/***/ }),

/***/ "./node_modules/@dnd-kit/core/dist/core.esm.js":
/*!*****************************************************!*\
  !*** ./node_modules/@dnd-kit/core/dist/core.esm.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AutoScrollActivator": () => (/* binding */ AutoScrollActivator),
/* harmony export */   "DndContext": () => (/* binding */ DndContext),
/* harmony export */   "DragOverlay": () => (/* binding */ DragOverlay),
/* harmony export */   "KeyboardCode": () => (/* binding */ KeyboardCode),
/* harmony export */   "KeyboardSensor": () => (/* binding */ KeyboardSensor),
/* harmony export */   "MeasuringFrequency": () => (/* binding */ MeasuringFrequency),
/* harmony export */   "MeasuringStrategy": () => (/* binding */ MeasuringStrategy),
/* harmony export */   "MouseSensor": () => (/* binding */ MouseSensor),
/* harmony export */   "PointerSensor": () => (/* binding */ PointerSensor),
/* harmony export */   "TouchSensor": () => (/* binding */ TouchSensor),
/* harmony export */   "TraversalOrder": () => (/* binding */ TraversalOrder),
/* harmony export */   "applyModifiers": () => (/* binding */ applyModifiers),
/* harmony export */   "closestCenter": () => (/* binding */ closestCenter),
/* harmony export */   "closestCorners": () => (/* binding */ closestCorners),
/* harmony export */   "defaultAnnouncements": () => (/* binding */ defaultAnnouncements),
/* harmony export */   "defaultCoordinates": () => (/* binding */ defaultCoordinates),
/* harmony export */   "defaultDropAnimation": () => (/* binding */ defaultDropAnimationConfiguration),
/* harmony export */   "defaultDropAnimationSideEffects": () => (/* binding */ defaultDropAnimationSideEffects),
/* harmony export */   "defaultScreenReaderInstructions": () => (/* binding */ defaultScreenReaderInstructions),
/* harmony export */   "getClientRect": () => (/* binding */ getClientRect),
/* harmony export */   "getFirstCollision": () => (/* binding */ getFirstCollision),
/* harmony export */   "getScrollableAncestors": () => (/* binding */ getScrollableAncestors),
/* harmony export */   "pointerWithin": () => (/* binding */ pointerWithin),
/* harmony export */   "rectIntersection": () => (/* binding */ rectIntersection),
/* harmony export */   "useDndContext": () => (/* binding */ useDndContext),
/* harmony export */   "useDndMonitor": () => (/* binding */ useDndMonitor),
/* harmony export */   "useDraggable": () => (/* binding */ useDraggable),
/* harmony export */   "useDroppable": () => (/* binding */ useDroppable),
/* harmony export */   "useSensor": () => (/* binding */ useSensor),
/* harmony export */   "useSensors": () => (/* binding */ useSensors)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dnd-kit/utilities */ "./node_modules/@dnd-kit/utilities/dist/utilities.esm.js");
/* harmony import */ var _dnd_kit_accessibility__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dnd-kit/accessibility */ "./node_modules/@dnd-kit/accessibility/dist/accessibility.esm.js");





const DndMonitorContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

function useDndMonitor(listener) {
  const registerListener = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(DndMonitorContext);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!registerListener) {
      throw new Error('useDndMonitor must be used within a children of <DndContext>');
    }

    const unsubscribe = registerListener(listener);
    return unsubscribe;
  }, [listener, registerListener]);
}

function useDndMonitorProvider() {
  const [listeners] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => new Set());
  const registerListener = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [listeners]);
  const dispatch = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(_ref => {
    let {
      type,
      event
    } = _ref;
    listeners.forEach(listener => {
      var _listener$type;

      return (_listener$type = listener[type]) == null ? void 0 : _listener$type.call(listener, event);
    });
  }, [listeners]);
  return [dispatch, registerListener];
}

const defaultScreenReaderInstructions = {
  draggable: "\n    To pick up a draggable item, press the space bar.\n    While dragging, use the arrow keys to move the item.\n    Press space again to drop the item in its new position, or press escape to cancel.\n  "
};
const defaultAnnouncements = {
  onDragStart(_ref) {
    let {
      active
    } = _ref;
    return "Picked up draggable item " + active.id + ".";
  },

  onDragOver(_ref2) {
    let {
      active,
      over
    } = _ref2;

    if (over) {
      return "Draggable item " + active.id + " was moved over droppable area " + over.id + ".";
    }

    return "Draggable item " + active.id + " is no longer over a droppable area.";
  },

  onDragEnd(_ref3) {
    let {
      active,
      over
    } = _ref3;

    if (over) {
      return "Draggable item " + active.id + " was dropped over droppable area " + over.id;
    }

    return "Draggable item " + active.id + " was dropped.";
  },

  onDragCancel(_ref4) {
    let {
      active
    } = _ref4;
    return "Dragging was cancelled. Draggable item " + active.id + " was dropped.";
  }

};

function Accessibility(_ref) {
  let {
    announcements = defaultAnnouncements,
    container,
    hiddenTextDescribedById,
    screenReaderInstructions = defaultScreenReaderInstructions
  } = _ref;
  const {
    announce,
    announcement
  } = (0,_dnd_kit_accessibility__WEBPACK_IMPORTED_MODULE_3__.useAnnouncement)();
  const liveRegionId = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)("DndLiveRegion");
  const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setMounted(true);
  }, []);
  useDndMonitor((0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    onDragStart(_ref2) {
      let {
        active
      } = _ref2;
      announce(announcements.onDragStart({
        active
      }));
    },

    onDragMove(_ref3) {
      let {
        active,
        over
      } = _ref3;

      if (announcements.onDragMove) {
        announce(announcements.onDragMove({
          active,
          over
        }));
      }
    },

    onDragOver(_ref4) {
      let {
        active,
        over
      } = _ref4;
      announce(announcements.onDragOver({
        active,
        over
      }));
    },

    onDragEnd(_ref5) {
      let {
        active,
        over
      } = _ref5;
      announce(announcements.onDragEnd({
        active,
        over
      }));
    },

    onDragCancel(_ref6) {
      let {
        active,
        over
      } = _ref6;
      announce(announcements.onDragCancel({
        active,
        over
      }));
    }

  }), [announce, announcements]));

  if (!mounted) {
    return null;
  }

  const markup = react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_dnd_kit_accessibility__WEBPACK_IMPORTED_MODULE_3__.HiddenText, {
    id: hiddenTextDescribedById,
    value: screenReaderInstructions.draggable
  }), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_dnd_kit_accessibility__WEBPACK_IMPORTED_MODULE_3__.LiveRegion, {
    id: liveRegionId,
    announcement: announcement
  }));
  return container ? (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)(markup, container) : markup;
}

var Action;

(function (Action) {
  Action["DragStart"] = "dragStart";
  Action["DragMove"] = "dragMove";
  Action["DragEnd"] = "dragEnd";
  Action["DragCancel"] = "dragCancel";
  Action["DragOver"] = "dragOver";
  Action["RegisterDroppable"] = "registerDroppable";
  Action["SetDroppableDisabled"] = "setDroppableDisabled";
  Action["UnregisterDroppable"] = "unregisterDroppable";
})(Action || (Action = {}));

function noop() {}

function useSensor(sensor, options) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    sensor,
    options: options != null ? options : {}
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [sensor, options]);
}

function useSensors() {
  for (var _len = arguments.length, sensors = new Array(_len), _key = 0; _key < _len; _key++) {
    sensors[_key] = arguments[_key];
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => [...sensors].filter(sensor => sensor != null), // eslint-disable-next-line react-hooks/exhaustive-deps
  [...sensors]);
}

const defaultCoordinates = /*#__PURE__*/Object.freeze({
  x: 0,
  y: 0
});

/**
 * Returns the distance between two points
 */
function distanceBetween(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getRelativeTransformOrigin(event, rect) {
  const eventCoordinates = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getEventCoordinates)(event);

  if (!eventCoordinates) {
    return '0 0';
  }

  const transformOrigin = {
    x: (eventCoordinates.x - rect.left) / rect.width * 100,
    y: (eventCoordinates.y - rect.top) / rect.height * 100
  };
  return transformOrigin.x + "% " + transformOrigin.y + "%";
}

/**
 * Sort collisions from smallest to greatest value
 */
function sortCollisionsAsc(_ref, _ref2) {
  let {
    data: {
      value: a
    }
  } = _ref;
  let {
    data: {
      value: b
    }
  } = _ref2;
  return a - b;
}
/**
 * Sort collisions from greatest to smallest value
 */

function sortCollisionsDesc(_ref3, _ref4) {
  let {
    data: {
      value: a
    }
  } = _ref3;
  let {
    data: {
      value: b
    }
  } = _ref4;
  return b - a;
}
/**
 * Returns the coordinates of the corners of a given rectangle:
 * [TopLeft {x, y}, TopRight {x, y}, BottomLeft {x, y}, BottomRight {x, y}]
 */

function cornersOfRectangle(_ref5) {
  let {
    left,
    top,
    height,
    width
  } = _ref5;
  return [{
    x: left,
    y: top
  }, {
    x: left + width,
    y: top
  }, {
    x: left,
    y: top + height
  }, {
    x: left + width,
    y: top + height
  }];
}
function getFirstCollision(collisions, property) {
  if (!collisions || collisions.length === 0) {
    return null;
  }

  const [firstCollision] = collisions;
  return property ? firstCollision[property] : firstCollision;
}

/**
 * Returns the coordinates of the center of a given ClientRect
 */

function centerOfRectangle(rect, left, top) {
  if (left === void 0) {
    left = rect.left;
  }

  if (top === void 0) {
    top = rect.top;
  }

  return {
    x: left + rect.width * 0.5,
    y: top + rect.height * 0.5
  };
}
/**
 * Returns the closest rectangles from an array of rectangles to the center of a given
 * rectangle.
 */


const closestCenter = _ref => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const centerRect = centerOfRectangle(collisionRect, collisionRect.left, collisionRect.top);
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const distBetween = distanceBetween(centerOfRectangle(rect), centerRect);
      collisions.push({
        id,
        data: {
          droppableContainer,
          value: distBetween
        }
      });
    }
  }

  return collisions.sort(sortCollisionsAsc);
};

/**
 * Returns the closest rectangles from an array of rectangles to the corners of
 * another rectangle.
 */

const closestCorners = _ref => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const corners = cornersOfRectangle(collisionRect);
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const rectCorners = cornersOfRectangle(rect);
      const distances = corners.reduce((accumulator, corner, index) => {
        return accumulator + distanceBetween(rectCorners[index], corner);
      }, 0);
      const effectiveDistance = Number((distances / 4).toFixed(4));
      collisions.push({
        id,
        data: {
          droppableContainer,
          value: effectiveDistance
        }
      });
    }
  }

  return collisions.sort(sortCollisionsAsc);
};

/**
 * Returns the intersecting rectangle area between two rectangles
 */

function getIntersectionRatio(entry, target) {
  const top = Math.max(target.top, entry.top);
  const left = Math.max(target.left, entry.left);
  const right = Math.min(target.left + target.width, entry.left + entry.width);
  const bottom = Math.min(target.top + target.height, entry.top + entry.height);
  const width = right - left;
  const height = bottom - top;

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height;
    const entryArea = entry.width * entry.height;
    const intersectionArea = width * height;
    const intersectionRatio = intersectionArea / (targetArea + entryArea - intersectionArea);
    return Number(intersectionRatio.toFixed(4));
  } // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)


  return 0;
}
/**
 * Returns the rectangles that has the greatest intersection area with a given
 * rectangle in an array of rectangles.
 */

const rectIntersection = _ref => {
  let {
    collisionRect,
    droppableRects,
    droppableContainers
  } = _ref;
  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect) {
      const intersectionRatio = getIntersectionRatio(rect, collisionRect);

      if (intersectionRatio > 0) {
        collisions.push({
          id,
          data: {
            droppableContainer,
            value: intersectionRatio
          }
        });
      }
    }
  }

  return collisions.sort(sortCollisionsDesc);
};

/**
 * Check if a given point is contained within a bounding rectangle
 */

function isPointWithinRect(point, rect) {
  const {
    top,
    left,
    bottom,
    right
  } = rect;
  return top <= point.y && point.y <= bottom && left <= point.x && point.x <= right;
}
/**
 * Returns the rectangles that the pointer is hovering over
 */


const pointerWithin = _ref => {
  let {
    droppableContainers,
    droppableRects,
    pointerCoordinates
  } = _ref;

  if (!pointerCoordinates) {
    return [];
  }

  const collisions = [];

  for (const droppableContainer of droppableContainers) {
    const {
      id
    } = droppableContainer;
    const rect = droppableRects.get(id);

    if (rect && isPointWithinRect(pointerCoordinates, rect)) {
      /* There may be more than a single rectangle intersecting
       * with the pointer coordinates. In order to sort the
       * colliding rectangles, we measure the distance between
       * the pointer and the corners of the intersecting rectangle
       */
      const corners = cornersOfRectangle(rect);
      const distances = corners.reduce((accumulator, corner) => {
        return accumulator + distanceBetween(pointerCoordinates, corner);
      }, 0);
      const effectiveDistance = Number((distances / 4).toFixed(4));
      collisions.push({
        id,
        data: {
          droppableContainer,
          value: effectiveDistance
        }
      });
    }
  }

  return collisions.sort(sortCollisionsAsc);
};

function adjustScale(transform, rect1, rect2) {
  return { ...transform,
    scaleX: rect1 && rect2 ? rect1.width / rect2.width : 1,
    scaleY: rect1 && rect2 ? rect1.height / rect2.height : 1
  };
}

function getRectDelta(rect1, rect2) {
  return rect1 && rect2 ? {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top
  } : defaultCoordinates;
}

function createRectAdjustmentFn(modifier) {
  return function adjustClientRect(rect) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }

    return adjustments.reduce((acc, adjustment) => ({ ...acc,
      top: acc.top + modifier * adjustment.y,
      bottom: acc.bottom + modifier * adjustment.y,
      left: acc.left + modifier * adjustment.x,
      right: acc.right + modifier * adjustment.x
    }), { ...rect
    });
  };
}
const getAdjustedRect = /*#__PURE__*/createRectAdjustmentFn(1);

function parseTransform(transform) {
  if (transform.startsWith('matrix3d(')) {
    const transformArray = transform.slice(9, -1).split(/, /);
    return {
      x: +transformArray[12],
      y: +transformArray[13],
      scaleX: +transformArray[0],
      scaleY: +transformArray[5]
    };
  } else if (transform.startsWith('matrix(')) {
    const transformArray = transform.slice(7, -1).split(/, /);
    return {
      x: +transformArray[4],
      y: +transformArray[5],
      scaleX: +transformArray[0],
      scaleY: +transformArray[3]
    };
  }

  return null;
}

function inverseTransform(rect, transform, transformOrigin) {
  const parsedTransform = parseTransform(transform);

  if (!parsedTransform) {
    return rect;
  }

  const {
    scaleX,
    scaleY,
    x: translateX,
    y: translateY
  } = parsedTransform;
  const x = rect.left - translateX - (1 - scaleX) * parseFloat(transformOrigin);
  const y = rect.top - translateY - (1 - scaleY) * parseFloat(transformOrigin.slice(transformOrigin.indexOf(' ') + 1));
  const w = scaleX ? rect.width / scaleX : rect.width;
  const h = scaleY ? rect.height / scaleY : rect.height;
  return {
    width: w,
    height: h,
    top: y,
    right: x + w,
    bottom: y + h,
    left: x
  };
}

const defaultOptions = {
  ignoreTransform: false
};
/**
 * Returns the bounding client rect of an element relative to the viewport.
 */

function getClientRect(element, options) {
  if (options === void 0) {
    options = defaultOptions;
  }

  let rect = element.getBoundingClientRect();

  if (options.ignoreTransform) {
    const {
      getComputedStyle
    } = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element);
    const {
      transform,
      transformOrigin
    } = getComputedStyle(element);

    if (transform) {
      rect = inverseTransform(rect, transform, transformOrigin);
    }
  }

  const {
    top,
    left,
    width,
    height,
    bottom,
    right
  } = rect;
  return {
    top,
    left,
    width,
    height,
    bottom,
    right
  };
}
/**
 * Returns the bounding client rect of an element relative to the viewport.
 *
 * @remarks
 * The ClientRect returned by this method does not take into account transforms
 * applied to the element it measures.
 *
 */

function getTransformAgnosticClientRect(element) {
  return getClientRect(element, {
    ignoreTransform: true
  });
}

function getWindowClientRect(element) {
  const width = element.innerWidth;
  const height = element.innerHeight;
  return {
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height
  };
}

function isFixed(node, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(node).getComputedStyle(node);
  }

  return computedStyle.position === 'fixed';
}

function isScrollable(element, computedStyle) {
  if (computedStyle === void 0) {
    computedStyle = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(element).getComputedStyle(element);
  }

  const overflowRegex = /(auto|scroll|overlay)/;
  const properties = ['overflow', 'overflowX', 'overflowY'];
  return properties.some(property => {
    const value = computedStyle[property];
    return typeof value === 'string' ? overflowRegex.test(value) : false;
  });
}

function getScrollableAncestors(element, limit) {
  const scrollParents = [];

  function findScrollableAncestors(node) {
    if (limit != null && scrollParents.length >= limit) {
      return scrollParents;
    }

    if (!node) {
      return scrollParents;
    }

    if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isDocument)(node) && node.scrollingElement != null && !scrollParents.includes(node.scrollingElement)) {
      scrollParents.push(node.scrollingElement);
      return scrollParents;
    }

    if (!(0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(node) || (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isSVGElement)(node)) {
      return scrollParents;
    }

    if (scrollParents.includes(node)) {
      return scrollParents;
    }

    const {
      getComputedStyle
    } = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(node);
    const computedStyle = getComputedStyle(node);

    if (node !== element) {
      if (isScrollable(node, computedStyle)) {
        scrollParents.push(node);
      }
    }

    if (isFixed(node, computedStyle)) {
      return scrollParents;
    }

    return findScrollableAncestors(node.parentNode);
  }

  if (!element) {
    return scrollParents;
  }

  return findScrollableAncestors(element);
}
function getFirstScrollableAncestor(node) {
  const [firstScrollableAncestor] = getScrollableAncestors(node, 1);
  return firstScrollableAncestor != null ? firstScrollableAncestor : null;
}

function getScrollableElement(element) {
  if (!_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.canUseDOM || !element) {
    return null;
  }

  if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isWindow)(element)) {
    return element;
  }

  if (!(0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isNode)(element)) {
    return null;
  }

  if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isDocument)(element) || element === (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(element).scrollingElement) {
    return window;
  }

  if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(element)) {
    return element;
  }

  return null;
}

function getScrollXCoordinate(element) {
  if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isWindow)(element)) {
    return element.scrollX;
  }

  return element.scrollLeft;
}
function getScrollYCoordinate(element) {
  if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isWindow)(element)) {
    return element.scrollY;
  }

  return element.scrollTop;
}
function getScrollCoordinates(element) {
  return {
    x: getScrollXCoordinate(element),
    y: getScrollYCoordinate(element)
  };
}

var Direction;

(function (Direction) {
  Direction[Direction["Forward"] = 1] = "Forward";
  Direction[Direction["Backward"] = -1] = "Backward";
})(Direction || (Direction = {}));

function isDocumentScrollingElement(element) {
  if (!_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.canUseDOM || !element) {
    return false;
  }

  return element === document.scrollingElement;
}

function getScrollPosition(scrollingContainer) {
  const minScroll = {
    x: 0,
    y: 0
  };
  const dimensions = isDocumentScrollingElement(scrollingContainer) ? {
    height: window.innerHeight,
    width: window.innerWidth
  } : {
    height: scrollingContainer.clientHeight,
    width: scrollingContainer.clientWidth
  };
  const maxScroll = {
    x: scrollingContainer.scrollWidth - dimensions.width,
    y: scrollingContainer.scrollHeight - dimensions.height
  };
  const isTop = scrollingContainer.scrollTop <= minScroll.y;
  const isLeft = scrollingContainer.scrollLeft <= minScroll.x;
  const isBottom = scrollingContainer.scrollTop >= maxScroll.y;
  const isRight = scrollingContainer.scrollLeft >= maxScroll.x;
  return {
    isTop,
    isLeft,
    isBottom,
    isRight,
    maxScroll,
    minScroll
  };
}

const defaultThreshold = {
  x: 0.2,
  y: 0.2
};
function getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, _ref, acceleration, thresholdPercentage) {
  let {
    top,
    left,
    right,
    bottom
  } = _ref;

  if (acceleration === void 0) {
    acceleration = 10;
  }

  if (thresholdPercentage === void 0) {
    thresholdPercentage = defaultThreshold;
  }

  const {
    isTop,
    isBottom,
    isLeft,
    isRight
  } = getScrollPosition(scrollContainer);
  const direction = {
    x: 0,
    y: 0
  };
  const speed = {
    x: 0,
    y: 0
  };
  const threshold = {
    height: scrollContainerRect.height * thresholdPercentage.y,
    width: scrollContainerRect.width * thresholdPercentage.x
  };

  if (!isTop && top <= scrollContainerRect.top + threshold.height) {
    // Scroll Up
    direction.y = Direction.Backward;
    speed.y = acceleration * Math.abs((scrollContainerRect.top + threshold.height - top) / threshold.height);
  } else if (!isBottom && bottom >= scrollContainerRect.bottom - threshold.height) {
    // Scroll Down
    direction.y = Direction.Forward;
    speed.y = acceleration * Math.abs((scrollContainerRect.bottom - threshold.height - bottom) / threshold.height);
  }

  if (!isRight && right >= scrollContainerRect.right - threshold.width) {
    // Scroll Right
    direction.x = Direction.Forward;
    speed.x = acceleration * Math.abs((scrollContainerRect.right - threshold.width - right) / threshold.width);
  } else if (!isLeft && left <= scrollContainerRect.left + threshold.width) {
    // Scroll Left
    direction.x = Direction.Backward;
    speed.x = acceleration * Math.abs((scrollContainerRect.left + threshold.width - left) / threshold.width);
  }

  return {
    direction,
    speed
  };
}

function getScrollElementRect(element) {
  if (element === document.scrollingElement) {
    const {
      innerWidth,
      innerHeight
    } = window;
    return {
      top: 0,
      left: 0,
      right: innerWidth,
      bottom: innerHeight,
      width: innerWidth,
      height: innerHeight
    };
  }

  const {
    top,
    left,
    right,
    bottom
  } = element.getBoundingClientRect();
  return {
    top,
    left,
    right,
    bottom,
    width: element.clientWidth,
    height: element.clientHeight
  };
}

function getScrollOffsets(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)(acc, getScrollCoordinates(node));
  }, defaultCoordinates);
}
function getScrollXOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollXCoordinate(node);
  }, 0);
}
function getScrollYOffset(scrollableAncestors) {
  return scrollableAncestors.reduce((acc, node) => {
    return acc + getScrollYCoordinate(node);
  }, 0);
}

function scrollIntoViewIfNeeded(element, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }

  if (!element) {
    return;
  }

  const {
    top,
    left,
    bottom,
    right
  } = measure(element);
  const firstScrollableAncestor = getFirstScrollableAncestor(element);

  if (!firstScrollableAncestor) {
    return;
  }

  if (bottom <= 0 || right <= 0 || top >= window.innerHeight || left >= window.innerWidth) {
    element.scrollIntoView({
      block: 'center',
      inline: 'center'
    });
  }
}

const properties = [['x', ['left', 'right'], getScrollXOffset], ['y', ['top', 'bottom'], getScrollYOffset]];
class Rect {
  constructor(rect, element) {
    this.rect = void 0;
    this.width = void 0;
    this.height = void 0;
    this.top = void 0;
    this.bottom = void 0;
    this.right = void 0;
    this.left = void 0;
    const scrollableAncestors = getScrollableAncestors(element);
    const scrollOffsets = getScrollOffsets(scrollableAncestors);
    this.rect = { ...rect
    };
    this.width = rect.width;
    this.height = rect.height;

    for (const [axis, keys, getScrollOffset] of properties) {
      for (const key of keys) {
        Object.defineProperty(this, key, {
          get: () => {
            const currentOffsets = getScrollOffset(scrollableAncestors);
            const scrollOffsetsDeltla = scrollOffsets[axis] - currentOffsets;
            return this.rect[key] + scrollOffsetsDeltla;
          },
          enumerable: true
        });
      }
    }

    Object.defineProperty(this, 'rect', {
      enumerable: false
    });
  }

}

class Listeners {
  constructor(target) {
    this.target = void 0;
    this.listeners = [];

    this.removeAll = () => {
      this.listeners.forEach(listener => {
        var _this$target;

        return (_this$target = this.target) == null ? void 0 : _this$target.removeEventListener(...listener);
      });
    };

    this.target = target;
  }

  add(eventName, handler, options) {
    var _this$target2;

    (_this$target2 = this.target) == null ? void 0 : _this$target2.addEventListener(eventName, handler, options);
    this.listeners.push([eventName, handler, options]);
  }

}

function getEventListenerTarget(target) {
  // If the `event.target` element is removed from the document events will still be targeted
  // at it, and hence won't always bubble up to the window or document anymore.
  // If there is any risk of an element being removed while it is being dragged,
  // the best practice is to attach the event listeners directly to the target.
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
  const {
    EventTarget
  } = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(target);
  return target instanceof EventTarget ? target : (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(target);
}

function hasExceededDistance(delta, measurement) {
  const dx = Math.abs(delta.x);
  const dy = Math.abs(delta.y);

  if (typeof measurement === 'number') {
    return Math.sqrt(dx ** 2 + dy ** 2) > measurement;
  }

  if ('x' in measurement && 'y' in measurement) {
    return dx > measurement.x && dy > measurement.y;
  }

  if ('x' in measurement) {
    return dx > measurement.x;
  }

  if ('y' in measurement) {
    return dy > measurement.y;
  }

  return false;
}

var EventName;

(function (EventName) {
  EventName["Click"] = "click";
  EventName["DragStart"] = "dragstart";
  EventName["Keydown"] = "keydown";
  EventName["ContextMenu"] = "contextmenu";
  EventName["Resize"] = "resize";
  EventName["SelectionChange"] = "selectionchange";
  EventName["VisibilityChange"] = "visibilitychange";
})(EventName || (EventName = {}));

function preventDefault(event) {
  event.preventDefault();
}
function stopPropagation(event) {
  event.stopPropagation();
}

var KeyboardCode;

(function (KeyboardCode) {
  KeyboardCode["Space"] = "Space";
  KeyboardCode["Down"] = "ArrowDown";
  KeyboardCode["Right"] = "ArrowRight";
  KeyboardCode["Left"] = "ArrowLeft";
  KeyboardCode["Up"] = "ArrowUp";
  KeyboardCode["Esc"] = "Escape";
  KeyboardCode["Enter"] = "Enter";
})(KeyboardCode || (KeyboardCode = {}));

const defaultKeyboardCodes = {
  start: [KeyboardCode.Space, KeyboardCode.Enter],
  cancel: [KeyboardCode.Esc],
  end: [KeyboardCode.Space, KeyboardCode.Enter]
};
const defaultKeyboardCoordinateGetter = (event, _ref) => {
  let {
    currentCoordinates
  } = _ref;

  switch (event.code) {
    case KeyboardCode.Right:
      return { ...currentCoordinates,
        x: currentCoordinates.x + 25
      };

    case KeyboardCode.Left:
      return { ...currentCoordinates,
        x: currentCoordinates.x - 25
      };

    case KeyboardCode.Down:
      return { ...currentCoordinates,
        y: currentCoordinates.y + 25
      };

    case KeyboardCode.Up:
      return { ...currentCoordinates,
        y: currentCoordinates.y - 25
      };
  }

  return undefined;
};

class KeyboardSensor {
  constructor(props) {
    this.props = void 0;
    this.autoScrollEnabled = false;
    this.referenceCoordinates = void 0;
    this.listeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    const {
      event: {
        target
      }
    } = props;
    this.props = props;
    this.listeners = new Listeners((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(target));
    this.windowListeners = new Listeners((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(target));
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.attach();
  }

  attach() {
    this.handleStart();
    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    setTimeout(() => this.listeners.add(EventName.Keydown, this.handleKeyDown));
  }

  handleStart() {
    const {
      activeNode,
      onStart
    } = this.props;
    const node = activeNode.node.current;

    if (node) {
      scrollIntoViewIfNeeded(node);
    }

    onStart(defaultCoordinates);
  }

  handleKeyDown(event) {
    if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isKeyboardEvent)(event)) {
      const {
        active,
        context,
        options
      } = this.props;
      const {
        keyboardCodes = defaultKeyboardCodes,
        coordinateGetter = defaultKeyboardCoordinateGetter,
        scrollBehavior = 'smooth'
      } = options;
      const {
        code
      } = event;

      if (keyboardCodes.end.includes(code)) {
        this.handleEnd(event);
        return;
      }

      if (keyboardCodes.cancel.includes(code)) {
        this.handleCancel(event);
        return;
      }

      const {
        collisionRect
      } = context.current;
      const currentCoordinates = collisionRect ? {
        x: collisionRect.left,
        y: collisionRect.top
      } : defaultCoordinates;

      if (!this.referenceCoordinates) {
        this.referenceCoordinates = currentCoordinates;
      }

      const newCoordinates = coordinateGetter(event, {
        active,
        context: context.current,
        currentCoordinates
      });

      if (newCoordinates) {
        const coordinatesDelta = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.subtract)(newCoordinates, currentCoordinates);
        const scrollDelta = {
          x: 0,
          y: 0
        };
        const {
          scrollableAncestors
        } = context.current;

        for (const scrollContainer of scrollableAncestors) {
          const direction = event.code;
          const {
            isTop,
            isRight,
            isLeft,
            isBottom,
            maxScroll,
            minScroll
          } = getScrollPosition(scrollContainer);
          const scrollElementRect = getScrollElementRect(scrollContainer);
          const clampedCoordinates = {
            x: Math.min(direction === KeyboardCode.Right ? scrollElementRect.right - scrollElementRect.width / 2 : scrollElementRect.right, Math.max(direction === KeyboardCode.Right ? scrollElementRect.left : scrollElementRect.left + scrollElementRect.width / 2, newCoordinates.x)),
            y: Math.min(direction === KeyboardCode.Down ? scrollElementRect.bottom - scrollElementRect.height / 2 : scrollElementRect.bottom, Math.max(direction === KeyboardCode.Down ? scrollElementRect.top : scrollElementRect.top + scrollElementRect.height / 2, newCoordinates.y))
          };
          const canScrollX = direction === KeyboardCode.Right && !isRight || direction === KeyboardCode.Left && !isLeft;
          const canScrollY = direction === KeyboardCode.Down && !isBottom || direction === KeyboardCode.Up && !isTop;

          if (canScrollX && clampedCoordinates.x !== newCoordinates.x) {
            const newScrollCoordinates = scrollContainer.scrollLeft + coordinatesDelta.x;
            const canScrollToNewCoordinates = direction === KeyboardCode.Right && newScrollCoordinates <= maxScroll.x || direction === KeyboardCode.Left && newScrollCoordinates >= minScroll.x;

            if (canScrollToNewCoordinates && !coordinatesDelta.y) {
              // We don't need to update coordinates, the scroll adjustment alone will trigger
              // logic to auto-detect the new container we are over
              scrollContainer.scrollTo({
                left: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }

            if (canScrollToNewCoordinates) {
              scrollDelta.x = scrollContainer.scrollLeft - newScrollCoordinates;
            } else {
              scrollDelta.x = direction === KeyboardCode.Right ? scrollContainer.scrollLeft - maxScroll.x : scrollContainer.scrollLeft - minScroll.x;
            }

            if (scrollDelta.x) {
              scrollContainer.scrollBy({
                left: -scrollDelta.x,
                behavior: scrollBehavior
              });
            }

            break;
          } else if (canScrollY && clampedCoordinates.y !== newCoordinates.y) {
            const newScrollCoordinates = scrollContainer.scrollTop + coordinatesDelta.y;
            const canScrollToNewCoordinates = direction === KeyboardCode.Down && newScrollCoordinates <= maxScroll.y || direction === KeyboardCode.Up && newScrollCoordinates >= minScroll.y;

            if (canScrollToNewCoordinates && !coordinatesDelta.x) {
              // We don't need to update coordinates, the scroll adjustment alone will trigger
              // logic to auto-detect the new container we are over
              scrollContainer.scrollTo({
                top: newScrollCoordinates,
                behavior: scrollBehavior
              });
              return;
            }

            if (canScrollToNewCoordinates) {
              scrollDelta.y = scrollContainer.scrollTop - newScrollCoordinates;
            } else {
              scrollDelta.y = direction === KeyboardCode.Down ? scrollContainer.scrollTop - maxScroll.y : scrollContainer.scrollTop - minScroll.y;
            }

            if (scrollDelta.y) {
              scrollContainer.scrollBy({
                top: -scrollDelta.y,
                behavior: scrollBehavior
              });
            }

            break;
          }
        }

        this.handleMove(event, (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.subtract)(newCoordinates, this.referenceCoordinates), scrollDelta));
      }
    }
  }

  handleMove(event, coordinates) {
    const {
      onMove
    } = this.props;
    event.preventDefault();
    onMove(coordinates);
  }

  handleEnd(event) {
    const {
      onEnd
    } = this.props;
    event.preventDefault();
    this.detach();
    onEnd();
  }

  handleCancel(event) {
    const {
      onCancel
    } = this.props;
    event.preventDefault();
    this.detach();
    onCancel();
  }

  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll();
  }

}
KeyboardSensor.activators = [{
  eventName: 'onKeyDown',
  handler: (event, _ref, _ref2) => {
    let {
      keyboardCodes = defaultKeyboardCodes,
      onActivation
    } = _ref;
    let {
      active
    } = _ref2;
    const {
      code
    } = event.nativeEvent;

    if (keyboardCodes.start.includes(code)) {
      const activator = active.activatorNode.current;

      if (activator && event.target !== activator) {
        return false;
      }

      event.preventDefault();
      onActivation == null ? void 0 : onActivation({
        event: event.nativeEvent
      });
      return true;
    }

    return false;
  }
}];

function isDistanceConstraint(constraint) {
  return Boolean(constraint && 'distance' in constraint);
}

function isDelayConstraint(constraint) {
  return Boolean(constraint && 'delay' in constraint);
}

class AbstractPointerSensor {
  constructor(props, events, listenerTarget) {
    var _getEventCoordinates;

    if (listenerTarget === void 0) {
      listenerTarget = getEventListenerTarget(props.event.target);
    }

    this.props = void 0;
    this.events = void 0;
    this.autoScrollEnabled = true;
    this.document = void 0;
    this.activated = false;
    this.initialCoordinates = void 0;
    this.timeoutId = null;
    this.listeners = void 0;
    this.documentListeners = void 0;
    this.windowListeners = void 0;
    this.props = props;
    this.events = events;
    const {
      event
    } = props;
    const {
      target
    } = event;
    this.props = props;
    this.events = events;
    this.document = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(target);
    this.documentListeners = new Listeners(this.document);
    this.listeners = new Listeners(listenerTarget);
    this.windowListeners = new Listeners((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(target));
    this.initialCoordinates = (_getEventCoordinates = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getEventCoordinates)(event)) != null ? _getEventCoordinates : defaultCoordinates;
    this.handleStart = this.handleStart.bind(this);
    this.handleMove = this.handleMove.bind(this);
    this.handleEnd = this.handleEnd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.removeTextSelection = this.removeTextSelection.bind(this);
    this.attach();
  }

  attach() {
    const {
      events,
      props: {
        options: {
          activationConstraint
        }
      }
    } = this;
    this.listeners.add(events.move.name, this.handleMove, {
      passive: false
    });
    this.listeners.add(events.end.name, this.handleEnd);
    this.windowListeners.add(EventName.Resize, this.handleCancel);
    this.windowListeners.add(EventName.DragStart, preventDefault);
    this.windowListeners.add(EventName.VisibilityChange, this.handleCancel);
    this.windowListeners.add(EventName.ContextMenu, preventDefault);
    this.documentListeners.add(EventName.Keydown, this.handleKeydown);

    if (activationConstraint) {
      if (isDistanceConstraint(activationConstraint)) {
        return;
      }

      if (isDelayConstraint(activationConstraint)) {
        this.timeoutId = setTimeout(this.handleStart, activationConstraint.delay);
        return;
      }
    }

    this.handleStart();
  }

  detach() {
    this.listeners.removeAll();
    this.windowListeners.removeAll(); // Wait until the next event loop before removing document listeners
    // This is necessary because we listen for `click` and `selection` events on the document

    setTimeout(this.documentListeners.removeAll, 50);

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  handleStart() {
    const {
      initialCoordinates
    } = this;
    const {
      onStart
    } = this.props;

    if (initialCoordinates) {
      this.activated = true; // Stop propagation of click events once activation constraints are met

      this.documentListeners.add(EventName.Click, stopPropagation, {
        capture: true
      }); // Remove any text selection from the document

      this.removeTextSelection(); // Prevent further text selection while dragging

      this.documentListeners.add(EventName.SelectionChange, this.removeTextSelection);
      onStart(initialCoordinates);
    }
  }

  handleMove(event) {
    var _getEventCoordinates2;

    const {
      activated,
      initialCoordinates,
      props
    } = this;
    const {
      onMove,
      options: {
        activationConstraint
      }
    } = props;

    if (!initialCoordinates) {
      return;
    }

    const coordinates = (_getEventCoordinates2 = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getEventCoordinates)(event)) != null ? _getEventCoordinates2 : defaultCoordinates;
    const delta = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.subtract)(initialCoordinates, coordinates);

    if (!activated && activationConstraint) {
      // Constraint validation
      if (isDelayConstraint(activationConstraint)) {
        if (hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }

        return;
      }

      if (isDistanceConstraint(activationConstraint)) {
        if (activationConstraint.tolerance != null && hasExceededDistance(delta, activationConstraint.tolerance)) {
          return this.handleCancel();
        }

        if (hasExceededDistance(delta, activationConstraint.distance)) {
          return this.handleStart();
        }

        return;
      }
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    onMove(coordinates);
  }

  handleEnd() {
    const {
      onEnd
    } = this.props;
    this.detach();
    onEnd();
  }

  handleCancel() {
    const {
      onCancel
    } = this.props;
    this.detach();
    onCancel();
  }

  handleKeydown(event) {
    if (event.code === KeyboardCode.Esc) {
      this.handleCancel();
    }
  }

  removeTextSelection() {
    var _this$document$getSel;

    (_this$document$getSel = this.document.getSelection()) == null ? void 0 : _this$document$getSel.removeAllRanges();
  }

}

const events = {
  move: {
    name: 'pointermove'
  },
  end: {
    name: 'pointerup'
  }
};
class PointerSensor extends AbstractPointerSensor {
  constructor(props) {
    const {
      event
    } = props; // Pointer events stop firing if the target is unmounted while dragging
    // Therefore we attach listeners to the owner document instead

    const listenerTarget = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(event.target);
    super(props, events, listenerTarget);
  }

}
PointerSensor.activators = [{
  eventName: 'onPointerDown',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;

    if (!event.isPrimary || event.button !== 0) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

const events$1 = {
  move: {
    name: 'mousemove'
  },
  end: {
    name: 'mouseup'
  }
};
var MouseButton;

(function (MouseButton) {
  MouseButton[MouseButton["RightClick"] = 2] = "RightClick";
})(MouseButton || (MouseButton = {}));

class MouseSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$1, (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getOwnerDocument)(props.event.target));
  }

}
MouseSensor.activators = [{
  eventName: 'onMouseDown',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;

    if (event.button === MouseButton.RightClick) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

const events$2 = {
  move: {
    name: 'touchmove'
  },
  end: {
    name: 'touchend'
  }
};
class TouchSensor extends AbstractPointerSensor {
  constructor(props) {
    super(props, events$2);
  }

  static setup() {
    // Adding a non-capture and non-passive `touchmove` listener in order
    // to force `event.preventDefault()` calls to work in dynamically added
    // touchmove event handlers. This is required for iOS Safari.
    window.addEventListener(events$2.move.name, noop, {
      capture: false,
      passive: false
    });
    return function teardown() {
      window.removeEventListener(events$2.move.name, noop);
    }; // We create a new handler because the teardown function of another sensor
    // could remove our event listener if we use a referentially equal listener.

    function noop() {}
  }

}
TouchSensor.activators = [{
  eventName: 'onTouchStart',
  handler: (_ref, _ref2) => {
    let {
      nativeEvent: event
    } = _ref;
    let {
      onActivation
    } = _ref2;
    const {
      touches
    } = event;

    if (touches.length > 1) {
      return false;
    }

    onActivation == null ? void 0 : onActivation({
      event
    });
    return true;
  }
}];

var AutoScrollActivator;

(function (AutoScrollActivator) {
  AutoScrollActivator[AutoScrollActivator["Pointer"] = 0] = "Pointer";
  AutoScrollActivator[AutoScrollActivator["DraggableRect"] = 1] = "DraggableRect";
})(AutoScrollActivator || (AutoScrollActivator = {}));

var TraversalOrder;

(function (TraversalOrder) {
  TraversalOrder[TraversalOrder["TreeOrder"] = 0] = "TreeOrder";
  TraversalOrder[TraversalOrder["ReversedTreeOrder"] = 1] = "ReversedTreeOrder";
})(TraversalOrder || (TraversalOrder = {}));

function useAutoScroller(_ref) {
  let {
    acceleration,
    activator = AutoScrollActivator.Pointer,
    canScroll,
    draggingRect,
    enabled,
    interval = 5,
    order = TraversalOrder.TreeOrder,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects,
    delta,
    threshold
  } = _ref;
  const scrollIntent = useScrollIntent({
    delta,
    disabled: !enabled
  });
  const [setAutoScrollInterval, clearAutoScrollInterval] = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useInterval)();
  const scrollSpeed = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const scrollDirection = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    x: 0,
    y: 0
  });
  const rect = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    switch (activator) {
      case AutoScrollActivator.Pointer:
        return pointerCoordinates ? {
          top: pointerCoordinates.y,
          bottom: pointerCoordinates.y,
          left: pointerCoordinates.x,
          right: pointerCoordinates.x
        } : null;

      case AutoScrollActivator.DraggableRect:
        return draggingRect;
    }
  }, [activator, draggingRect, pointerCoordinates]);
  const scrollContainerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const autoScroll = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const scrollLeft = scrollSpeed.current.x * scrollDirection.current.x;
    const scrollTop = scrollSpeed.current.y * scrollDirection.current.y;
    scrollContainer.scrollBy(scrollLeft, scrollTop);
  }, []);
  const sortedScrollableAncestors = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => order === TraversalOrder.TreeOrder ? [...scrollableAncestors].reverse() : scrollableAncestors, [order, scrollableAncestors]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!enabled || !scrollableAncestors.length || !rect) {
      clearAutoScrollInterval();
      return;
    }

    for (const scrollContainer of sortedScrollableAncestors) {
      if ((canScroll == null ? void 0 : canScroll(scrollContainer)) === false) {
        continue;
      }

      const index = scrollableAncestors.indexOf(scrollContainer);
      const scrollContainerRect = scrollableAncestorRects[index];

      if (!scrollContainerRect) {
        continue;
      }

      const {
        direction,
        speed
      } = getScrollDirectionAndSpeed(scrollContainer, scrollContainerRect, rect, acceleration, threshold);

      for (const axis of ['x', 'y']) {
        if (!scrollIntent[axis][direction[axis]]) {
          speed[axis] = 0;
          direction[axis] = 0;
        }
      }

      if (speed.x > 0 || speed.y > 0) {
        clearAutoScrollInterval();
        scrollContainerRef.current = scrollContainer;
        setAutoScrollInterval(autoScroll, interval);
        scrollSpeed.current = speed;
        scrollDirection.current = direction;
        return;
      }
    }

    scrollSpeed.current = {
      x: 0,
      y: 0
    };
    scrollDirection.current = {
      x: 0,
      y: 0
    };
    clearAutoScrollInterval();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [acceleration, autoScroll, canScroll, clearAutoScrollInterval, enabled, interval, // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(rect), // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(scrollIntent), setAutoScrollInterval, scrollableAncestors, sortedScrollableAncestors, scrollableAncestorRects, // eslint-disable-next-line react-hooks/exhaustive-deps
  JSON.stringify(threshold)]);
}
const defaultScrollIntent = {
  x: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  },
  y: {
    [Direction.Backward]: false,
    [Direction.Forward]: false
  }
};

function useScrollIntent(_ref2) {
  let {
    delta,
    disabled
  } = _ref2;
  const previousDelta = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.usePrevious)(delta);
  return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLazyMemo)(previousIntent => {
    if (disabled || !previousDelta || !previousIntent) {
      // Reset scroll intent tracking when auto-scrolling is disabled
      return defaultScrollIntent;
    }

    const direction = {
      x: Math.sign(delta.x - previousDelta.x),
      y: Math.sign(delta.y - previousDelta.y)
    }; // Keep track of the user intent to scroll in each direction for both axis

    return {
      x: {
        [Direction.Backward]: previousIntent.x[Direction.Backward] || direction.x === -1,
        [Direction.Forward]: previousIntent.x[Direction.Forward] || direction.x === 1
      },
      y: {
        [Direction.Backward]: previousIntent.y[Direction.Backward] || direction.y === -1,
        [Direction.Forward]: previousIntent.y[Direction.Forward] || direction.y === 1
      }
    };
  }, [disabled, delta, previousDelta]);
}

function useCachedNode(draggableNodes, id) {
  const draggableNode = id !== null ? draggableNodes.get(id) : undefined;
  const node = draggableNode ? draggableNode.node.current : null;
  return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLazyMemo)(cachedNode => {
    var _ref;

    if (id === null) {
      return null;
    } // In some cases, the draggable node can unmount while dragging
    // This is the case for virtualized lists. In those situations,
    // we fall back to the last known value for that node.


    return (_ref = node != null ? node : cachedNode) != null ? _ref : null;
  }, [node, id]);
}

function useCombineActivators(sensors, getSyntheticHandler) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => sensors.reduce((accumulator, sensor) => {
    const {
      sensor: Sensor
    } = sensor;
    const sensorActivators = Sensor.activators.map(activator => ({
      eventName: activator.eventName,
      handler: getSyntheticHandler(activator.handler, sensor)
    }));
    return [...accumulator, ...sensorActivators];
  }, []), [sensors, getSyntheticHandler]);
}

var MeasuringStrategy;

(function (MeasuringStrategy) {
  MeasuringStrategy[MeasuringStrategy["Always"] = 0] = "Always";
  MeasuringStrategy[MeasuringStrategy["BeforeDragging"] = 1] = "BeforeDragging";
  MeasuringStrategy[MeasuringStrategy["WhileDragging"] = 2] = "WhileDragging";
})(MeasuringStrategy || (MeasuringStrategy = {}));

var MeasuringFrequency;

(function (MeasuringFrequency) {
  MeasuringFrequency["Optimized"] = "optimized";
})(MeasuringFrequency || (MeasuringFrequency = {}));

const defaultValue = /*#__PURE__*/new Map();
function useDroppableMeasuring(containers, _ref) {
  let {
    dragging,
    dependencies,
    config
  } = _ref;
  const [queue, setQueue] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const {
    frequency,
    measure,
    strategy
  } = config;
  const containersRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(containers);
  const disabled = isDisabled();
  const disabledRef = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLatestValue)(disabled);
  const measureDroppableContainers = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (ids) {
    if (ids === void 0) {
      ids = [];
    }

    if (disabledRef.current) {
      return;
    }

    setQueue(value => {
      if (value === null) {
        return ids;
      }

      return value.concat(ids.filter(id => !value.includes(id)));
    });
  }, [disabledRef]);
  const timeoutId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const droppableRects = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLazyMemo)(previousValue => {
    if (disabled && !dragging) {
      return defaultValue;
    }

    if (!previousValue || previousValue === defaultValue || containersRef.current !== containers || queue != null) {
      const map = new Map();

      for (let container of containers) {
        if (!container) {
          continue;
        }

        if (queue && queue.length > 0 && !queue.includes(container.id) && container.rect.current) {
          // This container does not need to be re-measured
          map.set(container.id, container.rect.current);
          continue;
        }

        const node = container.node.current;
        const rect = node ? new Rect(measure(node), node) : null;
        container.rect.current = rect;

        if (rect) {
          map.set(container.id, rect);
        }
      }

      return map;
    }

    return previousValue;
  }, [containers, queue, dragging, disabled, measure]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    containersRef.current = containers;
  }, [containers]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (disabled) {
      return;
    }

    measureDroppableContainers();
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [dragging, disabled]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (queue && queue.length > 0) {
      setQueue(null);
    }
  }, //eslint-disable-next-line react-hooks/exhaustive-deps
  [JSON.stringify(queue)]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (disabled || typeof frequency !== 'number' || timeoutId.current !== null) {
      return;
    }

    timeoutId.current = setTimeout(() => {
      measureDroppableContainers();
      timeoutId.current = null;
    }, frequency);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [frequency, disabled, measureDroppableContainers, ...dependencies]);
  return {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled: queue != null
  };

  function isDisabled() {
    switch (strategy) {
      case MeasuringStrategy.Always:
        return false;

      case MeasuringStrategy.BeforeDragging:
        return dragging;

      default:
        return !dragging;
    }
  }
}

function useInitialValue(value, computeFn) {
  return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLazyMemo)(previousValue => {
    if (!value) {
      return null;
    }

    if (previousValue) {
      return previousValue;
    }

    return typeof computeFn === 'function' ? computeFn(value) : value;
  }, [computeFn, value]);
}

function useInitialRect(node, measure) {
  return useInitialValue(node, measure);
}

/**
 * Returns a new MutationObserver instance.
 * If `MutationObserver` is undefined in the execution environment, returns `undefined`.
 */

function useMutationObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleMutations = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useEvent)(callback);
  const mutationObserver = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (disabled || typeof window === 'undefined' || typeof window.MutationObserver === 'undefined') {
      return undefined;
    }

    const {
      MutationObserver
    } = window;
    return new MutationObserver(handleMutations);
  }, [handleMutations, disabled]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => mutationObserver == null ? void 0 : mutationObserver.disconnect();
  }, [mutationObserver]);
  return mutationObserver;
}

/**
 * Returns a new ResizeObserver instance bound to the `onResize` callback.
 * If `ResizeObserver` is undefined in the execution environment, returns `undefined`.
 */

function useResizeObserver(_ref) {
  let {
    callback,
    disabled
  } = _ref;
  const handleResize = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useEvent)(callback);
  const resizeObserver = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (disabled || typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
      return undefined;
    }

    const {
      ResizeObserver
    } = window;
    return new ResizeObserver(handleResize);
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [disabled]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    return () => resizeObserver == null ? void 0 : resizeObserver.disconnect();
  }, [resizeObserver]);
  return resizeObserver;
}

function defaultMeasure(element) {
  return new Rect(getClientRect(element), element);
}

function useRect(element, measure, fallbackRect) {
  if (measure === void 0) {
    measure = defaultMeasure;
  }

  const [rect, measureRect] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(reducer, null);
  const mutationObserver = useMutationObserver({
    callback(records) {
      if (!element) {
        return;
      }

      for (const record of records) {
        const {
          type,
          target
        } = record;

        if (type === 'childList' && target instanceof HTMLElement && target.contains(element)) {
          measureRect();
          break;
        }
      }
    }

  });
  const resizeObserver = useResizeObserver({
    callback: measureRect
  });
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    measureRect();

    if (element) {
      resizeObserver == null ? void 0 : resizeObserver.observe(element);
      mutationObserver == null ? void 0 : mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      mutationObserver == null ? void 0 : mutationObserver.disconnect();
    }
  }, [element]);
  return rect;

  function reducer(currentRect) {
    if (!element) {
      return null;
    }

    if (element.isConnected === false) {
      var _ref;

      // Fall back to last rect we measured if the element is
      // no longer connected to the DOM.
      return (_ref = currentRect != null ? currentRect : fallbackRect) != null ? _ref : null;
    }

    const newRect = measure(element);

    if (JSON.stringify(currentRect) === JSON.stringify(newRect)) {
      return currentRect;
    }

    return newRect;
  }
}

function useRectDelta(rect) {
  const initialRect = useInitialValue(rect);
  return getRectDelta(rect, initialRect);
}

const defaultValue$1 = [];
function useScrollableAncestors(node) {
  const previousNode = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(node);
  const ancestors = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLazyMemo)(previousValue => {
    if (!node) {
      return defaultValue$1;
    }

    if (previousValue && previousValue !== defaultValue$1 && node && previousNode.current && node.parentNode === previousNode.current.parentNode) {
      return previousValue;
    }

    return getScrollableAncestors(node);
  }, [node]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    previousNode.current = node;
  }, [node]);
  return ancestors;
}

function useScrollOffsets(elements) {
  const [scrollCoordinates, setScrollCoordinates] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const prevElements = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(elements); // To-do: Throttle the handleScroll callback

  const handleScroll = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(event => {
    const scrollingElement = getScrollableElement(event.target);

    if (!scrollingElement) {
      return;
    }

    setScrollCoordinates(scrollCoordinates => {
      if (!scrollCoordinates) {
        return null;
      }

      scrollCoordinates.set(scrollingElement, getScrollCoordinates(scrollingElement));
      return new Map(scrollCoordinates);
    });
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const previousElements = prevElements.current;

    if (elements !== previousElements) {
      cleanup(previousElements);
      const entries = elements.map(element => {
        const scrollableElement = getScrollableElement(element);

        if (scrollableElement) {
          scrollableElement.addEventListener('scroll', handleScroll, {
            passive: true
          });
          return [scrollableElement, getScrollCoordinates(scrollableElement)];
        }

        return null;
      }).filter(entry => entry != null);
      setScrollCoordinates(entries.length ? new Map(entries) : null);
      prevElements.current = elements;
    }

    return () => {
      cleanup(elements);
      cleanup(previousElements);
    };

    function cleanup(elements) {
      elements.forEach(element => {
        const scrollableElement = getScrollableElement(element);
        scrollableElement == null ? void 0 : scrollableElement.removeEventListener('scroll', handleScroll);
      });
    }
  }, [handleScroll, elements]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (elements.length) {
      return scrollCoordinates ? Array.from(scrollCoordinates.values()).reduce((acc, coordinates) => (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)(acc, coordinates), defaultCoordinates) : getScrollOffsets(elements);
    }

    return defaultCoordinates;
  }, [elements, scrollCoordinates]);
}

function useScrollOffsetsDelta(scrollOffsets, dependencies) {
  if (dependencies === void 0) {
    dependencies = [];
  }

  const initialScrollOffsets = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    initialScrollOffsets.current = null;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  dependencies);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const hasScrollOffsets = scrollOffsets !== defaultCoordinates;

    if (hasScrollOffsets && !initialScrollOffsets.current) {
      initialScrollOffsets.current = scrollOffsets;
    }

    if (!hasScrollOffsets && initialScrollOffsets.current) {
      initialScrollOffsets.current = null;
    }
  }, [scrollOffsets]);
  return initialScrollOffsets.current ? (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.subtract)(scrollOffsets, initialScrollOffsets.current) : defaultCoordinates;
}

function useSensorSetup(sensors) {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.canUseDOM) {
      return;
    }

    const teardownFns = sensors.map(_ref => {
      let {
        sensor
      } = _ref;
      return sensor.setup == null ? void 0 : sensor.setup();
    });
    return () => {
      for (const teardown of teardownFns) {
        teardown == null ? void 0 : teardown();
      }
    };
  }, // TO-DO: Sensors length could theoretically change which would not be a valid dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  sensors.map(_ref2 => {
    let {
      sensor
    } = _ref2;
    return sensor;
  }));
}

function useSyntheticListeners(listeners, id) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return listeners.reduce((acc, _ref) => {
      let {
        eventName,
        handler
      } = _ref;

      acc[eventName] = event => {
        handler(event, id);
      };

      return acc;
    }, {});
  }, [listeners, id]);
}

function useWindowRect(element) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => element ? getWindowClientRect(element) : null, [element]);
}

const defaultValue$2 = [];
function useRects(elements, measure) {
  if (measure === void 0) {
    measure = getClientRect;
  }

  const [firstElement] = elements;
  const windowRect = useWindowRect(firstElement ? (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(firstElement) : null);
  const [rects, measureRects] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(reducer, defaultValue$2);
  const resizeObserver = useResizeObserver({
    callback: measureRects
  });

  if (elements.length > 0 && rects === defaultValue$2) {
    measureRects();
  }

  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    if (elements.length) {
      elements.forEach(element => resizeObserver == null ? void 0 : resizeObserver.observe(element));
    } else {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      measureRects();
    }
  }, [elements]);
  return rects;

  function reducer() {
    if (!elements.length) {
      return defaultValue$2;
    }

    return elements.map(element => isDocumentScrollingElement(element) ? windowRect : new Rect(measure(element), element));
  }
}

function getMeasurableNode(node) {
  if (!node) {
    return null;
  }

  if (node.children.length > 1) {
    return node;
  }

  const firstChild = node.children[0];
  return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(firstChild) ? firstChild : node;
}

function useDragOverlayMeasuring(_ref) {
  let {
    measure
  } = _ref;
  const [rect, setRect] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const handleResize = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(entries => {
    for (const {
      target
    } of entries) {
      if ((0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isHTMLElement)(target)) {
        setRect(rect => {
          const newRect = measure(target);
          return rect ? { ...rect,
            width: newRect.width,
            height: newRect.height
          } : newRect;
        });
        break;
      }
    }
  }, [measure]);
  const resizeObserver = useResizeObserver({
    callback: handleResize
  });
  const handleNodeChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(element => {
    const node = getMeasurableNode(element);
    resizeObserver == null ? void 0 : resizeObserver.disconnect();

    if (node) {
      resizeObserver == null ? void 0 : resizeObserver.observe(node);
    }

    setRect(node ? measure(node) : null);
  }, [measure, resizeObserver]);
  const [nodeRef, setRef] = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useNodeRef)(handleNodeChange);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    nodeRef,
    rect,
    setRef
  }), [rect, nodeRef, setRef]);
}

const defaultSensors = [{
  sensor: PointerSensor,
  options: {}
}, {
  sensor: KeyboardSensor,
  options: {}
}];
const defaultData = {
  current: {}
};
const defaultMeasuringConfiguration = {
  draggable: {
    measure: getTransformAgnosticClientRect
  },
  droppable: {
    measure: getTransformAgnosticClientRect,
    strategy: MeasuringStrategy.WhileDragging,
    frequency: MeasuringFrequency.Optimized
  },
  dragOverlay: {
    measure: getClientRect
  }
};

class DroppableContainersMap extends Map {
  get(id) {
    var _super$get;

    return id != null ? (_super$get = super.get(id)) != null ? _super$get : undefined : undefined;
  }

  toArray() {
    return Array.from(this.values());
  }

  getEnabled() {
    return this.toArray().filter(_ref => {
      let {
        disabled
      } = _ref;
      return !disabled;
    });
  }

  getNodeFor(id) {
    var _this$get$node$curren, _this$get;

    return (_this$get$node$curren = (_this$get = this.get(id)) == null ? void 0 : _this$get.node.current) != null ? _this$get$node$curren : undefined;
  }

}

const defaultPublicContext = {
  activatorEvent: null,
  active: null,
  activeNode: null,
  activeNodeRect: null,
  collisions: null,
  containerNodeRect: null,
  draggableNodes: /*#__PURE__*/new Map(),
  droppableRects: /*#__PURE__*/new Map(),
  droppableContainers: /*#__PURE__*/new DroppableContainersMap(),
  over: null,
  dragOverlay: {
    nodeRef: {
      current: null
    },
    rect: null,
    setRef: noop
  },
  scrollableAncestors: [],
  scrollableAncestorRects: [],
  measuringConfiguration: defaultMeasuringConfiguration,
  measureDroppableContainers: noop,
  windowRect: null,
  measuringScheduled: false
};
const defaultInternalContext = {
  activatorEvent: null,
  activators: [],
  active: null,
  activeNodeRect: null,
  ariaDescribedById: {
    draggable: ''
  },
  dispatch: noop,
  draggableNodes: /*#__PURE__*/new Map(),
  over: null,
  measureDroppableContainers: noop
};
const InternalContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(defaultInternalContext);
const PublicContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(defaultPublicContext);

function getInitialState() {
  return {
    draggable: {
      active: null,
      initialCoordinates: {
        x: 0,
        y: 0
      },
      nodes: new Map(),
      translate: {
        x: 0,
        y: 0
      }
    },
    droppable: {
      containers: new DroppableContainersMap()
    }
  };
}
function reducer(state, action) {
  switch (action.type) {
    case Action.DragStart:
      return { ...state,
        draggable: { ...state.draggable,
          initialCoordinates: action.initialCoordinates,
          active: action.active
        }
      };

    case Action.DragMove:
      if (!state.draggable.active) {
        return state;
      }

      return { ...state,
        draggable: { ...state.draggable,
          translate: {
            x: action.coordinates.x - state.draggable.initialCoordinates.x,
            y: action.coordinates.y - state.draggable.initialCoordinates.y
          }
        }
      };

    case Action.DragEnd:
    case Action.DragCancel:
      return { ...state,
        draggable: { ...state.draggable,
          active: null,
          initialCoordinates: {
            x: 0,
            y: 0
          },
          translate: {
            x: 0,
            y: 0
          }
        }
      };

    case Action.RegisterDroppable:
      {
        const {
          element
        } = action;
        const {
          id
        } = element;
        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id, element);
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    case Action.SetDroppableDisabled:
      {
        const {
          id,
          key,
          disabled
        } = action;
        const element = state.droppable.containers.get(id);

        if (!element || key !== element.key) {
          return state;
        }

        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.set(id, { ...element,
          disabled
        });
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    case Action.UnregisterDroppable:
      {
        const {
          id,
          key
        } = action;
        const element = state.droppable.containers.get(id);

        if (!element || key !== element.key) {
          return state;
        }

        const containers = new DroppableContainersMap(state.droppable.containers);
        containers.delete(id);
        return { ...state,
          droppable: { ...state.droppable,
            containers
          }
        };
      }

    default:
      {
        return state;
      }
  }
}

function RestoreFocus(_ref) {
  let {
    disabled
  } = _ref;
  const {
    active,
    activatorEvent,
    draggableNodes
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(InternalContext);
  const previousActivatorEvent = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.usePrevious)(activatorEvent);
  const previousActiveId = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.usePrevious)(active == null ? void 0 : active.id); // Restore keyboard focus on the activator node

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (disabled) {
      return;
    }

    if (!activatorEvent && previousActivatorEvent && previousActiveId != null) {
      if (!(0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isKeyboardEvent)(previousActivatorEvent)) {
        return;
      }

      if (document.activeElement === previousActivatorEvent.target) {
        // No need to restore focus
        return;
      }

      const draggableNode = draggableNodes.get(previousActiveId);

      if (!draggableNode) {
        return;
      }

      const {
        activatorNode,
        node
      } = draggableNode;

      if (!activatorNode.current && !node.current) {
        return;
      }

      requestAnimationFrame(() => {
        for (const element of [activatorNode.current, node.current]) {
          if (!element) {
            continue;
          }

          const focusableNode = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.findFirstFocusableNode)(element);

          if (focusableNode) {
            focusableNode.focus();
            break;
          }
        }
      });
    }
  }, [activatorEvent, disabled, draggableNodes, previousActiveId, previousActivatorEvent]);
  return null;
}

function applyModifiers(modifiers, _ref) {
  let {
    transform,
    ...args
  } = _ref;
  return modifiers != null && modifiers.length ? modifiers.reduce((accumulator, modifier) => {
    return modifier({
      transform: accumulator,
      ...args
    });
  }, transform) : transform;
}

function useMeasuringConfiguration(config) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    draggable: { ...defaultMeasuringConfiguration.draggable,
      ...(config == null ? void 0 : config.draggable)
    },
    droppable: { ...defaultMeasuringConfiguration.droppable,
      ...(config == null ? void 0 : config.droppable)
    },
    dragOverlay: { ...defaultMeasuringConfiguration.dragOverlay,
      ...(config == null ? void 0 : config.dragOverlay)
    }
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [config == null ? void 0 : config.draggable, config == null ? void 0 : config.droppable, config == null ? void 0 : config.dragOverlay]);
}

function useLayoutShiftScrollCompensation(_ref) {
  let {
    activeNode,
    measure,
    initialRect,
    config = true
  } = _ref;
  const initialized = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const {
    x,
    y
  } = typeof config === 'boolean' ? {
    x: config,
    y: config
  } : config;
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    const disabled = !x && !y;

    if (disabled || !activeNode) {
      initialized.current = false;
      return;
    }

    if (initialized.current || !initialRect) {
      // Return early if layout shift scroll compensation was already attempted
      // or if there is no initialRect to compare to.
      return;
    } // Get the most up to date node ref for the active draggable


    const node = activeNode == null ? void 0 : activeNode.node.current;

    if (!node || node.isConnected === false) {
      // Return early if there is no attached node ref or if the node is
      // disconnected from the document.
      return;
    }

    const rect = measure(node);
    const rectDelta = getRectDelta(rect, initialRect);

    if (!x) {
      rectDelta.x = 0;
    }

    if (!y) {
      rectDelta.y = 0;
    } // Only perform layout shift scroll compensation once


    initialized.current = true;

    if (Math.abs(rectDelta.x) > 0 || Math.abs(rectDelta.y) > 0) {
      const firstScrollableAncestor = getFirstScrollableAncestor(node);

      if (firstScrollableAncestor) {
        firstScrollableAncestor.scrollBy({
          top: rectDelta.y,
          left: rectDelta.x
        });
      }
    }
  }, [activeNode, x, y, initialRect, measure]);
}

const ActiveDraggableContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({ ...defaultCoordinates,
  scaleX: 1,
  scaleY: 1
});
var Status;

(function (Status) {
  Status[Status["Uninitialized"] = 0] = "Uninitialized";
  Status[Status["Initializing"] = 1] = "Initializing";
  Status[Status["Initialized"] = 2] = "Initialized";
})(Status || (Status = {}));

const DndContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(function DndContext(_ref) {
  var _sensorContext$curren, _dragOverlay$nodeRef$, _dragOverlay$rect, _over$rect;

  let {
    id,
    accessibility,
    autoScroll = true,
    children,
    sensors = defaultSensors,
    collisionDetection = rectIntersection,
    measuring,
    modifiers,
    ...props
  } = _ref;
  const store = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(reducer, undefined, getInitialState);
  const [state, dispatch] = store;
  const [dispatchMonitorEvent, registerMonitorListener] = useDndMonitorProvider();
  const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(Status.Uninitialized);
  const isInitialized = status === Status.Initialized;
  const {
    draggable: {
      active: activeId,
      nodes: draggableNodes,
      translate
    },
    droppable: {
      containers: droppableContainers
    }
  } = state;
  const node = activeId ? draggableNodes.get(activeId) : null;
  const activeRects = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    initial: null,
    translated: null
  });
  const active = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    var _node$data;

    return activeId != null ? {
      id: activeId,
      // It's possible for the active node to unmount while dragging
      data: (_node$data = node == null ? void 0 : node.data) != null ? _node$data : defaultData,
      rect: activeRects
    } : null;
  }, [activeId, node]);
  const activeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [activeSensor, setActiveSensor] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [activatorEvent, setActivatorEvent] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const latestProps = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLatestValue)(props, Object.values(props));
  const draggableDescribedById = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)("DndDescribedBy", id);
  const enabledDroppableContainers = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => droppableContainers.getEnabled(), [droppableContainers]);
  const measuringConfiguration = useMeasuringConfiguration(measuring);
  const {
    droppableRects,
    measureDroppableContainers,
    measuringScheduled
  } = useDroppableMeasuring(enabledDroppableContainers, {
    dragging: isInitialized,
    dependencies: [translate.x, translate.y],
    config: measuringConfiguration.droppable
  });
  const activeNode = useCachedNode(draggableNodes, activeId);
  const activationCoordinates = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => activatorEvent ? (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getEventCoordinates)(activatorEvent) : null, [activatorEvent]);
  const autoScrollOptions = getAutoScrollerOptions();
  const initialActiveNodeRect = useInitialRect(activeNode, measuringConfiguration.draggable.measure);
  useLayoutShiftScrollCompensation({
    activeNode: activeId ? draggableNodes.get(activeId) : null,
    config: autoScrollOptions.layoutShiftCompensation,
    initialRect: initialActiveNodeRect,
    measure: measuringConfiguration.draggable.measure
  });
  const activeNodeRect = useRect(activeNode, measuringConfiguration.draggable.measure, initialActiveNodeRect);
  const containerNodeRect = useRect(activeNode ? activeNode.parentElement : null);
  const sensorContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    activatorEvent: null,
    active: null,
    activeNode,
    collisionRect: null,
    collisions: null,
    droppableRects,
    draggableNodes,
    draggingNode: null,
    draggingNodeRect: null,
    droppableContainers,
    over: null,
    scrollableAncestors: [],
    scrollAdjustedTranslate: null
  });
  const overNode = droppableContainers.getNodeFor((_sensorContext$curren = sensorContext.current.over) == null ? void 0 : _sensorContext$curren.id);
  const dragOverlay = useDragOverlayMeasuring({
    measure: measuringConfiguration.dragOverlay.measure
  }); // Use the rect of the drag overlay if it is mounted

  const draggingNode = (_dragOverlay$nodeRef$ = dragOverlay.nodeRef.current) != null ? _dragOverlay$nodeRef$ : activeNode;
  const draggingNodeRect = isInitialized ? (_dragOverlay$rect = dragOverlay.rect) != null ? _dragOverlay$rect : activeNodeRect : null;
  const usesDragOverlay = Boolean(dragOverlay.nodeRef.current && dragOverlay.rect); // The delta between the previous and new position of the draggable node
  // is only relevant when there is no drag overlay

  const nodeRectDelta = useRectDelta(usesDragOverlay ? null : activeNodeRect); // Get the window rect of the dragging node

  const windowRect = useWindowRect(draggingNode ? (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(draggingNode) : null); // Get scrollable ancestors of the dragging node

  const scrollableAncestors = useScrollableAncestors(isInitialized ? overNode != null ? overNode : activeNode : null);
  const scrollableAncestorRects = useRects(scrollableAncestors); // Apply modifiers

  const modifiedTranslate = applyModifiers(modifiers, {
    transform: {
      x: translate.x - nodeRectDelta.x,
      y: translate.y - nodeRectDelta.y,
      scaleX: 1,
      scaleY: 1
    },
    activatorEvent,
    active,
    activeNodeRect,
    containerNodeRect,
    draggingNodeRect,
    over: sensorContext.current.over,
    overlayNodeRect: dragOverlay.rect,
    scrollableAncestors,
    scrollableAncestorRects,
    windowRect
  });
  const pointerCoordinates = activationCoordinates ? (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)(activationCoordinates, translate) : null;
  const scrollOffsets = useScrollOffsets(scrollableAncestors); // Represents the scroll delta since dragging was initiated

  const scrollAdjustment = useScrollOffsetsDelta(scrollOffsets); // Represents the scroll delta since the last time the active node rect was measured

  const activeNodeScrollDelta = useScrollOffsetsDelta(scrollOffsets, [activeNodeRect]);
  const scrollAdjustedTranslate = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)(modifiedTranslate, scrollAdjustment);
  const collisionRect = draggingNodeRect ? getAdjustedRect(draggingNodeRect, modifiedTranslate) : null;
  const collisions = active && collisionRect ? collisionDetection({
    active,
    collisionRect,
    droppableRects,
    droppableContainers: enabledDroppableContainers,
    pointerCoordinates
  }) : null;
  const overId = getFirstCollision(collisions, 'id');
  const [over, setOver] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null); // When there is no drag overlay used, we need to account for the
  // window scroll delta

  const appliedTranslate = usesDragOverlay ? modifiedTranslate : (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.add)(modifiedTranslate, activeNodeScrollDelta);
  const transform = adjustScale(appliedTranslate, (_over$rect = over == null ? void 0 : over.rect) != null ? _over$rect : null, activeNodeRect);
  const instantiateSensor = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((event, _ref2) => {
    let {
      sensor: Sensor,
      options
    } = _ref2;

    if (activeRef.current == null) {
      return;
    }

    const activeNode = draggableNodes.get(activeRef.current);

    if (!activeNode) {
      return;
    }

    const activatorEvent = event.nativeEvent;
    const sensorInstance = new Sensor({
      active: activeRef.current,
      activeNode,
      event: activatorEvent,
      options,
      // Sensors need to be instantiated with refs for arguments that change over time
      // otherwise they are frozen in time with the stale arguments
      context: sensorContext,

      onStart(initialCoordinates) {
        const id = activeRef.current;

        if (id == null) {
          return;
        }

        const draggableNode = draggableNodes.get(id);

        if (!draggableNode) {
          return;
        }

        const {
          onDragStart
        } = latestProps.current;
        const event = {
          active: {
            id,
            data: draggableNode.data,
            rect: activeRects
          }
        };
        (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.unstable_batchedUpdates)(() => {
          onDragStart == null ? void 0 : onDragStart(event);
          setStatus(Status.Initializing);
          dispatch({
            type: Action.DragStart,
            initialCoordinates,
            active: id
          });
          dispatchMonitorEvent({
            type: 'onDragStart',
            event
          });
        });
      },

      onMove(coordinates) {
        dispatch({
          type: Action.DragMove,
          coordinates
        });
      },

      onEnd: createHandler(Action.DragEnd),
      onCancel: createHandler(Action.DragCancel)
    });
    (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.unstable_batchedUpdates)(() => {
      setActiveSensor(sensorInstance);
      setActivatorEvent(event.nativeEvent);
    });

    function createHandler(type) {
      return async function handler() {
        const {
          active,
          collisions,
          over,
          scrollAdjustedTranslate
        } = sensorContext.current;
        let event = null;

        if (active && scrollAdjustedTranslate) {
          const {
            cancelDrop
          } = latestProps.current;
          event = {
            activatorEvent,
            active: active,
            collisions,
            delta: scrollAdjustedTranslate,
            over
          };

          if (type === Action.DragEnd && typeof cancelDrop === 'function') {
            const shouldCancel = await Promise.resolve(cancelDrop(event));

            if (shouldCancel) {
              type = Action.DragCancel;
            }
          }
        }

        activeRef.current = null;
        (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.unstable_batchedUpdates)(() => {
          dispatch({
            type
          });
          setStatus(Status.Uninitialized);
          setOver(null);
          setActiveSensor(null);
          setActivatorEvent(null);
          const eventName = type === Action.DragEnd ? 'onDragEnd' : 'onDragCancel';

          if (event) {
            const handler = latestProps.current[eventName];
            handler == null ? void 0 : handler(event);
            dispatchMonitorEvent({
              type: eventName,
              event
            });
          }
        });
      };
    }
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [draggableNodes]);
  const bindActivatorToSensorInstantiator = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((handler, sensor) => {
    return (event, active) => {
      const nativeEvent = event.nativeEvent;
      const activeDraggableNode = draggableNodes.get(active);

      if ( // Another sensor is already instantiating
      activeRef.current !== null || // No active draggable
      !activeDraggableNode || // Event has already been captured
      nativeEvent.dndKit || nativeEvent.defaultPrevented) {
        return;
      }

      const activationContext = {
        active: activeDraggableNode
      };
      const shouldActivate = handler(event, sensor.options, activationContext);

      if (shouldActivate === true) {
        nativeEvent.dndKit = {
          capturedBy: sensor.sensor
        };
        activeRef.current = active;
        instantiateSensor(event, sensor);
      }
    };
  }, [draggableNodes, instantiateSensor]);
  const activators = useCombineActivators(sensors, bindActivatorToSensorInstantiator);
  useSensorSetup(sensors);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    if (activeNodeRect && status === Status.Initializing) {
      setStatus(Status.Initialized);
    }
  }, [activeNodeRect, status]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      onDragMove
    } = latestProps.current;
    const {
      active,
      activatorEvent,
      collisions,
      over
    } = sensorContext.current;

    if (!active || !activatorEvent) {
      return;
    }

    const event = {
      active,
      activatorEvent,
      collisions,
      delta: {
        x: scrollAdjustedTranslate.x,
        y: scrollAdjustedTranslate.y
      },
      over
    };
    (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.unstable_batchedUpdates)(() => {
      onDragMove == null ? void 0 : onDragMove(event);
      dispatchMonitorEvent({
        type: 'onDragMove',
        event
      });
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [scrollAdjustedTranslate.x, scrollAdjustedTranslate.y]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const {
      active,
      activatorEvent,
      collisions,
      droppableContainers,
      scrollAdjustedTranslate
    } = sensorContext.current;

    if (!active || activeRef.current == null || !activatorEvent || !scrollAdjustedTranslate) {
      return;
    }

    const {
      onDragOver
    } = latestProps.current;
    const overContainer = droppableContainers.get(overId);
    const over = overContainer && overContainer.rect.current ? {
      id: overContainer.id,
      rect: overContainer.rect.current,
      data: overContainer.data,
      disabled: overContainer.disabled
    } : null;
    const event = {
      active,
      activatorEvent,
      collisions,
      delta: {
        x: scrollAdjustedTranslate.x,
        y: scrollAdjustedTranslate.y
      },
      over
    };
    (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.unstable_batchedUpdates)(() => {
      setOver(over);
      onDragOver == null ? void 0 : onDragOver(event);
      dispatchMonitorEvent({
        type: 'onDragOver',
        event
      });
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [overId]);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    sensorContext.current = {
      activatorEvent,
      active,
      activeNode,
      collisionRect,
      collisions,
      droppableRects,
      draggableNodes,
      draggingNode,
      draggingNodeRect,
      droppableContainers,
      over,
      scrollableAncestors,
      scrollAdjustedTranslate
    };
    activeRects.current = {
      initial: draggingNodeRect,
      translated: collisionRect
    };
  }, [active, activeNode, collisions, collisionRect, draggableNodes, draggingNode, draggingNodeRect, droppableRects, droppableContainers, over, scrollableAncestors, scrollAdjustedTranslate]);
  useAutoScroller({ ...autoScrollOptions,
    delta: translate,
    draggingRect: collisionRect,
    pointerCoordinates,
    scrollableAncestors,
    scrollableAncestorRects
  });
  const publicContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const context = {
      active,
      activeNode,
      activeNodeRect,
      activatorEvent,
      collisions,
      containerNodeRect,
      dragOverlay,
      draggableNodes,
      droppableContainers,
      droppableRects,
      over,
      measureDroppableContainers,
      scrollableAncestors,
      scrollableAncestorRects,
      measuringConfiguration,
      measuringScheduled,
      windowRect
    };
    return context;
  }, [active, activeNode, activeNodeRect, activatorEvent, collisions, containerNodeRect, dragOverlay, draggableNodes, droppableContainers, droppableRects, over, measureDroppableContainers, scrollableAncestors, scrollableAncestorRects, measuringConfiguration, measuringScheduled, windowRect]);
  const internalContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const context = {
      activatorEvent,
      activators,
      active,
      activeNodeRect,
      ariaDescribedById: {
        draggable: draggableDescribedById
      },
      dispatch,
      draggableNodes,
      over,
      measureDroppableContainers
    };
    return context;
  }, [activatorEvent, activators, active, activeNodeRect, dispatch, draggableDescribedById, draggableNodes, over, measureDroppableContainers]);
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(DndMonitorContext.Provider, {
    value: registerMonitorListener
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InternalContext.Provider, {
    value: internalContext
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PublicContext.Provider, {
    value: publicContext
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ActiveDraggableContext.Provider, {
    value: transform
  }, children)), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(RestoreFocus, {
    disabled: (accessibility == null ? void 0 : accessibility.restoreFocus) === false
  })), react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Accessibility, { ...accessibility,
    hiddenTextDescribedById: draggableDescribedById
  }));

  function getAutoScrollerOptions() {
    const activeSensorDisablesAutoscroll = (activeSensor == null ? void 0 : activeSensor.autoScrollEnabled) === false;
    const autoScrollGloballyDisabled = typeof autoScroll === 'object' ? autoScroll.enabled === false : autoScroll === false;
    const enabled = isInitialized && !activeSensorDisablesAutoscroll && !autoScrollGloballyDisabled;

    if (typeof autoScroll === 'object') {
      return { ...autoScroll,
        enabled
      };
    }

    return {
      enabled
    };
  }
});

const NullContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
const defaultRole = 'button';
const ID_PREFIX = 'Droppable';
function useDraggable(_ref) {
  let {
    id,
    data,
    disabled = false,
    attributes
  } = _ref;
  const key = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)(ID_PREFIX);
  const {
    activators,
    activatorEvent,
    active,
    activeNodeRect,
    ariaDescribedById,
    draggableNodes,
    over
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(InternalContext);
  const {
    role = defaultRole,
    roleDescription = 'draggable',
    tabIndex = 0
  } = attributes != null ? attributes : {};
  const isDragging = (active == null ? void 0 : active.id) === id;
  const transform = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(isDragging ? ActiveDraggableContext : NullContext);
  const [node, setNodeRef] = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useNodeRef)();
  const [activatorNode, setActivatorNodeRef] = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useNodeRef)();
  const listeners = useSyntheticListeners(activators, id);
  const dataRef = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLatestValue)(data);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    draggableNodes.set(id, {
      id,
      key,
      node,
      activatorNode,
      data: dataRef
    });
    return () => {
      const node = draggableNodes.get(id);

      if (node && node.key === key) {
        draggableNodes.delete(id);
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [draggableNodes, id]);
  const memoizedAttributes = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    role,
    tabIndex,
    'aria-disabled': disabled,
    'aria-pressed': isDragging && role === defaultRole ? true : undefined,
    'aria-roledescription': roleDescription,
    'aria-describedby': ariaDescribedById.draggable
  }), [disabled, role, tabIndex, isDragging, roleDescription, ariaDescribedById.draggable]);
  return {
    active,
    activatorEvent,
    activeNodeRect,
    attributes: memoizedAttributes,
    isDragging,
    listeners: disabled ? undefined : listeners,
    node,
    over,
    setNodeRef,
    setActivatorNodeRef,
    transform
  };
}

function useDndContext() {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(PublicContext);
}

const ID_PREFIX$1 = 'Droppable';
const defaultResizeObserverConfig = {
  timeout: 25
};
function useDroppable(_ref) {
  let {
    data,
    disabled = false,
    id,
    resizeObserverConfig
  } = _ref;
  const key = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)(ID_PREFIX$1);
  const {
    active,
    dispatch,
    over,
    measureDroppableContainers
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(InternalContext);
  const previous = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    disabled
  });
  const resizeObserverConnected = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  const rect = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const callbackId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const {
    disabled: resizeObserverDisabled,
    updateMeasurementsFor,
    timeout: resizeObserverTimeout
  } = { ...defaultResizeObserverConfig,
    ...resizeObserverConfig
  };
  const ids = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLatestValue)(updateMeasurementsFor != null ? updateMeasurementsFor : id);
  const handleResize = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (!resizeObserverConnected.current) {
      // ResizeObserver invokes the `handleResize` callback as soon as `observe` is called,
      // assuming the element is rendered and displayed.
      resizeObserverConnected.current = true;
      return;
    }

    if (callbackId.current != null) {
      clearTimeout(callbackId.current);
    }

    callbackId.current = setTimeout(() => {
      measureDroppableContainers(Array.isArray(ids.current) ? ids.current : [ids.current]);
      callbackId.current = null;
    }, resizeObserverTimeout);
  }, //eslint-disable-next-line react-hooks/exhaustive-deps
  [resizeObserverTimeout]);
  const resizeObserver = useResizeObserver({
    callback: handleResize,
    disabled: resizeObserverDisabled || !active
  });
  const handleNodeChange = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((newElement, previousElement) => {
    if (!resizeObserver) {
      return;
    }

    if (previousElement) {
      resizeObserver.unobserve(previousElement);
      resizeObserverConnected.current = false;
    }

    if (newElement) {
      resizeObserver.observe(newElement);
    }
  }, [resizeObserver]);
  const [nodeRef, setNodeRef] = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useNodeRef)(handleNodeChange);
  const dataRef = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useLatestValue)(data);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!resizeObserver || !nodeRef.current) {
      return;
    }

    resizeObserver.disconnect();
    resizeObserverConnected.current = false;
    resizeObserver.observe(nodeRef.current);
  }, [nodeRef, resizeObserver]);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    dispatch({
      type: Action.RegisterDroppable,
      element: {
        id,
        key,
        disabled,
        node: nodeRef,
        rect,
        data: dataRef
      }
    });
    return () => dispatch({
      type: Action.UnregisterDroppable,
      key,
      id
    });
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [id]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (disabled !== previous.current.disabled) {
      dispatch({
        type: Action.SetDroppableDisabled,
        id,
        key,
        disabled
      });
      previous.current.disabled = disabled;
    }
  }, [id, key, disabled, dispatch]);
  return {
    active,
    rect,
    isOver: (over == null ? void 0 : over.id) === id,
    node: nodeRef,
    over,
    setNodeRef
  };
}

function AnimationManager(_ref) {
  let {
    animation,
    children
  } = _ref;
  const [clonedChildren, setClonedChildren] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [element, setElement] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const previousChildren = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.usePrevious)(children);

  if (!children && !clonedChildren && previousChildren) {
    setClonedChildren(previousChildren);
  }

  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    if (!element) {
      return;
    }

    const key = clonedChildren == null ? void 0 : clonedChildren.key;
    const id = clonedChildren == null ? void 0 : clonedChildren.props.id;

    if (key == null || id == null) {
      setClonedChildren(null);
      return;
    }

    Promise.resolve(animation(id, element)).then(() => {
      setClonedChildren(null);
    });
  }, [animation, clonedChildren, element]);
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, children, clonedChildren ? (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(clonedChildren, {
    ref: setElement
  }) : null);
}

const defaultTransform = {
  x: 0,
  y: 0,
  scaleX: 1,
  scaleY: 1
};
function NullifiedContextProvider(_ref) {
  let {
    children
  } = _ref;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(InternalContext.Provider, {
    value: defaultInternalContext
  }, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(ActiveDraggableContext.Provider, {
    value: defaultTransform
  }, children));
}

const baseStyles = {
  position: 'fixed',
  touchAction: 'none'
};

const defaultTransition = activatorEvent => {
  const isKeyboardActivator = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isKeyboardEvent)(activatorEvent);
  return isKeyboardActivator ? 'transform 250ms ease' : undefined;
};

const PositionedOverlay = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)((_ref, ref) => {
  let {
    as,
    activatorEvent,
    adjustScale,
    children,
    className,
    rect,
    style,
    transform,
    transition = defaultTransition
  } = _ref;

  if (!rect) {
    return null;
  }

  const scaleAdjustedTransform = adjustScale ? transform : { ...transform,
    scaleX: 1,
    scaleY: 1
  };
  const styles = { ...baseStyles,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    transform: _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.CSS.Transform.toString(scaleAdjustedTransform),
    transformOrigin: adjustScale && activatorEvent ? getRelativeTransformOrigin(activatorEvent, rect) : undefined,
    transition: typeof transition === 'function' ? transition(activatorEvent) : transition,
    ...style
  };
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(as, {
    className,
    style: styles,
    ref
  }, children);
});

const defaultDropAnimationSideEffects = options => _ref => {
  let {
    active,
    dragOverlay
  } = _ref;
  const originalStyles = {};
  const {
    styles,
    className
  } = options;

  if (styles != null && styles.active) {
    for (const [key, value] of Object.entries(styles.active)) {
      if (value === undefined) {
        continue;
      }

      originalStyles[key] = active.node.style.getPropertyValue(key);
      active.node.style.setProperty(key, value);
    }
  }

  if (styles != null && styles.dragOverlay) {
    for (const [key, value] of Object.entries(styles.dragOverlay)) {
      if (value === undefined) {
        continue;
      }

      dragOverlay.node.style.setProperty(key, value);
    }
  }

  if (className != null && className.active) {
    active.node.classList.add(className.active);
  }

  if (className != null && className.dragOverlay) {
    dragOverlay.node.classList.add(className.dragOverlay);
  }

  return function cleanup() {
    for (const [key, value] of Object.entries(originalStyles)) {
      active.node.style.setProperty(key, value);
    }

    if (className != null && className.active) {
      active.node.classList.remove(className.active);
    }
  };
};

const defaultKeyframeResolver = _ref2 => {
  let {
    transform: {
      initial,
      final
    }
  } = _ref2;
  return [{
    transform: _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.CSS.Transform.toString(initial)
  }, {
    transform: _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.CSS.Transform.toString(final)
  }];
};

const defaultDropAnimationConfiguration = {
  duration: 250,
  easing: 'ease',
  keyframes: defaultKeyframeResolver,
  sideEffects: /*#__PURE__*/defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0'
      }
    }
  })
};
function useDropAnimation(_ref3) {
  let {
    config,
    draggableNodes,
    droppableContainers,
    measuringConfiguration
  } = _ref3;
  return (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useEvent)((id, node) => {
    if (config === null) {
      return;
    }

    const activeDraggable = draggableNodes.get(id);

    if (!activeDraggable) {
      return;
    }

    const activeNode = activeDraggable.node.current;

    if (!activeNode) {
      return;
    }

    const measurableNode = getMeasurableNode(node);

    if (!measurableNode) {
      return;
    }

    const {
      transform
    } = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.getWindow)(node).getComputedStyle(node);
    const parsedTransform = parseTransform(transform);

    if (!parsedTransform) {
      return;
    }

    const animation = typeof config === 'function' ? config : createDefaultDropAnimation(config);
    scrollIntoViewIfNeeded(activeNode, measuringConfiguration.draggable.measure);
    return animation({
      active: {
        id,
        data: activeDraggable.data,
        node: activeNode,
        rect: measuringConfiguration.draggable.measure(activeNode)
      },
      draggableNodes,
      dragOverlay: {
        node,
        rect: measuringConfiguration.dragOverlay.measure(measurableNode)
      },
      droppableContainers,
      measuringConfiguration,
      transform: parsedTransform
    });
  });
}

function createDefaultDropAnimation(options) {
  const {
    duration,
    easing,
    sideEffects,
    keyframes
  } = { ...defaultDropAnimationConfiguration,
    ...options
  };
  return _ref4 => {
    let {
      active,
      dragOverlay,
      transform,
      ...rest
    } = _ref4;

    if (!duration) {
      // Do not animate if animation duration is zero.
      return;
    }

    const delta = {
      x: dragOverlay.rect.left - active.rect.left,
      y: dragOverlay.rect.top - active.rect.top
    };
    const scale = {
      scaleX: transform.scaleX !== 1 ? active.rect.width * transform.scaleX / dragOverlay.rect.width : 1,
      scaleY: transform.scaleY !== 1 ? active.rect.height * transform.scaleY / dragOverlay.rect.height : 1
    };
    const finalTransform = {
      x: transform.x - delta.x,
      y: transform.y - delta.y,
      ...scale
    };
    const animationKeyframes = keyframes({ ...rest,
      active,
      dragOverlay,
      transform: {
        initial: transform,
        final: finalTransform
      }
    });
    const [firstKeyframe] = animationKeyframes;
    const lastKeyframe = animationKeyframes[animationKeyframes.length - 1];

    if (JSON.stringify(firstKeyframe) === JSON.stringify(lastKeyframe)) {
      // The start and end keyframes are the same, infer that there is no animation needed.
      return;
    }

    const cleanup = sideEffects == null ? void 0 : sideEffects({
      active,
      dragOverlay,
      ...rest
    });
    const animation = dragOverlay.node.animate(animationKeyframes, {
      duration,
      easing,
      fill: 'forwards'
    });
    return new Promise(resolve => {
      animation.onfinish = () => {
        cleanup == null ? void 0 : cleanup();
        resolve();
      };
    });
  };
}

let key = 0;
function useKey(id) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (id == null) {
      return;
    }

    key++;
    return key;
  }, [id]);
}

const DragOverlay = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().memo(_ref => {
  let {
    adjustScale = false,
    children,
    dropAnimation: dropAnimationConfig,
    style,
    transition,
    modifiers,
    wrapperElement = 'div',
    className,
    zIndex = 999
  } = _ref;
  const {
    activatorEvent,
    active,
    activeNodeRect,
    containerNodeRect,
    draggableNodes,
    droppableContainers,
    dragOverlay,
    over,
    measuringConfiguration,
    scrollableAncestors,
    scrollableAncestorRects,
    windowRect
  } = useDndContext();
  const transform = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ActiveDraggableContext);
  const key = useKey(active == null ? void 0 : active.id);
  const modifiedTransform = applyModifiers(modifiers, {
    activatorEvent,
    active,
    activeNodeRect,
    containerNodeRect,
    draggingNodeRect: dragOverlay.rect,
    over,
    overlayNodeRect: dragOverlay.rect,
    scrollableAncestors,
    scrollableAncestorRects,
    transform,
    windowRect
  });
  const initialRect = useInitialValue(activeNodeRect);
  const dropAnimation = useDropAnimation({
    config: dropAnimationConfig,
    draggableNodes,
    droppableContainers,
    measuringConfiguration
  }); // We need to wait for the active node to be measured before connecting the drag overlay ref
  // otherwise collisions can be computed against a mispositioned drag overlay

  const ref = initialRect ? dragOverlay.setRef : undefined;
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(NullifiedContextProvider, null, react__WEBPACK_IMPORTED_MODULE_0___default().createElement(AnimationManager, {
    animation: dropAnimation
  }, active && key ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement(PositionedOverlay, {
    key: key,
    id: active.id,
    ref: ref,
    as: wrapperElement,
    activatorEvent: activatorEvent,
    adjustScale: adjustScale,
    className: className,
    transition: transition,
    rect: initialRect,
    style: {
      zIndex,
      ...style
    },
    transform: modifiedTransform
  }, children) : null));
});


//# sourceMappingURL=core.esm.js.map


/***/ }),

/***/ "./node_modules/@dnd-kit/sortable/dist/sortable.esm.js":
/*!*************************************************************!*\
  !*** ./node_modules/@dnd-kit/sortable/dist/sortable.esm.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SortableContext": () => (/* binding */ SortableContext),
/* harmony export */   "arrayMove": () => (/* binding */ arrayMove),
/* harmony export */   "arraySwap": () => (/* binding */ arraySwap),
/* harmony export */   "defaultAnimateLayoutChanges": () => (/* binding */ defaultAnimateLayoutChanges),
/* harmony export */   "defaultNewIndexGetter": () => (/* binding */ defaultNewIndexGetter),
/* harmony export */   "hasSortableData": () => (/* binding */ hasSortableData),
/* harmony export */   "horizontalListSortingStrategy": () => (/* binding */ horizontalListSortingStrategy),
/* harmony export */   "rectSortingStrategy": () => (/* binding */ rectSortingStrategy),
/* harmony export */   "rectSwappingStrategy": () => (/* binding */ rectSwappingStrategy),
/* harmony export */   "sortableKeyboardCoordinates": () => (/* binding */ sortableKeyboardCoordinates),
/* harmony export */   "useSortable": () => (/* binding */ useSortable),
/* harmony export */   "verticalListSortingStrategy": () => (/* binding */ verticalListSortingStrategy)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @dnd-kit/core */ "./node_modules/@dnd-kit/core/dist/core.esm.js");
/* harmony import */ var _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @dnd-kit/utilities */ "./node_modules/@dnd-kit/utilities/dist/utilities.esm.js");




/**
 * Move an array item to a different position. Returns a new array with the item moved to the new position.
 */
function arrayMove(array, from, to) {
  const newArray = array.slice();
  newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
  return newArray;
}

/**
 * Swap an array item to a different position. Returns a new array with the item swapped to the new position.
 */
function arraySwap(array, from, to) {
  const newArray = array.slice();
  newArray[from] = array[to];
  newArray[to] = array[from];
  return newArray;
}

function getSortedRects(items, rects) {
  return items.reduce((accumulator, id, index) => {
    const rect = rects.get(id);

    if (rect) {
      accumulator[index] = rect;
    }

    return accumulator;
  }, Array(items.length));
}

function isValidIndex(index) {
  return index !== null && index >= 0;
}

function itemsEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function normalizeDisabled(disabled) {
  if (typeof disabled === 'boolean') {
    return {
      draggable: disabled,
      droppable: disabled
    };
  }

  return disabled;
}

// To-do: We should be calculating scale transformation
const defaultScale = {
  scaleX: 1,
  scaleY: 1
};
const horizontalListSortingStrategy = _ref => {
  var _rects$activeIndex;

  let {
    rects,
    activeNodeRect: fallbackActiveRect,
    activeIndex,
    overIndex,
    index
  } = _ref;
  const activeNodeRect = (_rects$activeIndex = rects[activeIndex]) != null ? _rects$activeIndex : fallbackActiveRect;

  if (!activeNodeRect) {
    return null;
  }

  const itemGap = getItemGap(rects, index, activeIndex);

  if (index === activeIndex) {
    const newIndexRect = rects[overIndex];

    if (!newIndexRect) {
      return null;
    }

    return {
      x: activeIndex < overIndex ? newIndexRect.left + newIndexRect.width - (activeNodeRect.left + activeNodeRect.width) : newIndexRect.left - activeNodeRect.left,
      y: 0,
      ...defaultScale
    };
  }

  if (index > activeIndex && index <= overIndex) {
    return {
      x: -activeNodeRect.width - itemGap,
      y: 0,
      ...defaultScale
    };
  }

  if (index < activeIndex && index >= overIndex) {
    return {
      x: activeNodeRect.width + itemGap,
      y: 0,
      ...defaultScale
    };
  }

  return {
    x: 0,
    y: 0,
    ...defaultScale
  };
};

function getItemGap(rects, index, activeIndex) {
  const currentRect = rects[index];
  const previousRect = rects[index - 1];
  const nextRect = rects[index + 1];

  if (!currentRect || !previousRect && !nextRect) {
    return 0;
  }

  if (activeIndex < index) {
    return previousRect ? currentRect.left - (previousRect.left + previousRect.width) : nextRect.left - (currentRect.left + currentRect.width);
  }

  return nextRect ? nextRect.left - (currentRect.left + currentRect.width) : currentRect.left - (previousRect.left + previousRect.width);
}

const rectSortingStrategy = _ref => {
  let {
    rects,
    activeIndex,
    overIndex,
    index
  } = _ref;
  const newRects = arrayMove(rects, overIndex, activeIndex);
  const oldRect = rects[index];
  const newRect = newRects[index];

  if (!newRect || !oldRect) {
    return null;
  }

  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top,
    scaleX: newRect.width / oldRect.width,
    scaleY: newRect.height / oldRect.height
  };
};

const rectSwappingStrategy = _ref => {
  let {
    activeIndex,
    index,
    rects,
    overIndex
  } = _ref;
  let oldRect;
  let newRect;

  if (index === activeIndex) {
    oldRect = rects[index];
    newRect = rects[overIndex];
  }

  if (index === overIndex) {
    oldRect = rects[index];
    newRect = rects[activeIndex];
  }

  if (!newRect || !oldRect) {
    return null;
  }

  return {
    x: newRect.left - oldRect.left,
    y: newRect.top - oldRect.top,
    scaleX: newRect.width / oldRect.width,
    scaleY: newRect.height / oldRect.height
  };
};

// To-do: We should be calculating scale transformation
const defaultScale$1 = {
  scaleX: 1,
  scaleY: 1
};
const verticalListSortingStrategy = _ref => {
  var _rects$activeIndex;

  let {
    activeIndex,
    activeNodeRect: fallbackActiveRect,
    index,
    rects,
    overIndex
  } = _ref;
  const activeNodeRect = (_rects$activeIndex = rects[activeIndex]) != null ? _rects$activeIndex : fallbackActiveRect;

  if (!activeNodeRect) {
    return null;
  }

  if (index === activeIndex) {
    const overIndexRect = rects[overIndex];

    if (!overIndexRect) {
      return null;
    }

    return {
      x: 0,
      y: activeIndex < overIndex ? overIndexRect.top + overIndexRect.height - (activeNodeRect.top + activeNodeRect.height) : overIndexRect.top - activeNodeRect.top,
      ...defaultScale$1
    };
  }

  const itemGap = getItemGap$1(rects, index, activeIndex);

  if (index > activeIndex && index <= overIndex) {
    return {
      x: 0,
      y: -activeNodeRect.height - itemGap,
      ...defaultScale$1
    };
  }

  if (index < activeIndex && index >= overIndex) {
    return {
      x: 0,
      y: activeNodeRect.height + itemGap,
      ...defaultScale$1
    };
  }

  return {
    x: 0,
    y: 0,
    ...defaultScale$1
  };
};

function getItemGap$1(clientRects, index, activeIndex) {
  const currentRect = clientRects[index];
  const previousRect = clientRects[index - 1];
  const nextRect = clientRects[index + 1];

  if (!currentRect) {
    return 0;
  }

  if (activeIndex < index) {
    return previousRect ? currentRect.top - (previousRect.top + previousRect.height) : nextRect ? nextRect.top - (currentRect.top + currentRect.height) : 0;
  }

  return nextRect ? nextRect.top - (currentRect.top + currentRect.height) : previousRect ? currentRect.top - (previousRect.top + previousRect.height) : 0;
}

const ID_PREFIX = 'Sortable';
const Context = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createContext({
  activeIndex: -1,
  containerId: ID_PREFIX,
  disableTransforms: false,
  items: [],
  overIndex: -1,
  useDragOverlay: false,
  sortedRects: [],
  strategy: rectSortingStrategy,
  disabled: {
    draggable: false,
    droppable: false
  }
});
function SortableContext(_ref) {
  let {
    children,
    id,
    items: userDefinedItems,
    strategy = rectSortingStrategy,
    disabled: disabledProp = false
  } = _ref;
  const {
    active,
    dragOverlay,
    droppableRects,
    over,
    measureDroppableContainers
  } = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.useDndContext)();
  const containerId = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useUniqueId)(ID_PREFIX, id);
  const useDragOverlay = Boolean(dragOverlay.rect !== null);
  const items = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => userDefinedItems.map(item => typeof item === 'object' && 'id' in item ? item.id : item), [userDefinedItems]);
  const isDragging = active != null;
  const activeIndex = active ? items.indexOf(active.id) : -1;
  const overIndex = over ? items.indexOf(over.id) : -1;
  const previousItemsRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(items);
  const itemsHaveChanged = !itemsEqual(items, previousItemsRef.current);
  const disableTransforms = overIndex !== -1 && activeIndex === -1 || itemsHaveChanged;
  const disabled = normalizeDisabled(disabledProp);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    if (itemsHaveChanged && isDragging) {
      measureDroppableContainers(items);
    }
  }, [itemsHaveChanged, items, isDragging, measureDroppableContainers]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    previousItemsRef.current = items;
  }, [items]);
  const contextValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    activeIndex,
    containerId,
    disabled,
    disableTransforms,
    items,
    overIndex,
    useDragOverlay,
    sortedRects: getSortedRects(items, droppableRects),
    strategy
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [activeIndex, containerId, disabled.draggable, disabled.droppable, disableTransforms, items, overIndex, droppableRects, useDragOverlay, strategy]);
  return react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Context.Provider, {
    value: contextValue
  }, children);
}

const defaultNewIndexGetter = _ref => {
  let {
    id,
    items,
    activeIndex,
    overIndex
  } = _ref;
  return arrayMove(items, activeIndex, overIndex).indexOf(id);
};
const defaultAnimateLayoutChanges = _ref2 => {
  let {
    containerId,
    isSorting,
    wasDragging,
    index,
    items,
    newIndex,
    previousItems,
    previousContainerId,
    transition
  } = _ref2;

  if (!transition || !wasDragging) {
    return false;
  }

  if (previousItems !== items && index === newIndex) {
    return false;
  }

  if (isSorting) {
    return true;
  }

  return newIndex !== index && containerId === previousContainerId;
};
const defaultTransition = {
  duration: 200,
  easing: 'ease'
};
const transitionProperty = 'transform';
const disabledTransition = /*#__PURE__*/_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.CSS.Transition.toString({
  property: transitionProperty,
  duration: 0,
  easing: 'linear'
});
const defaultAttributes = {
  roleDescription: 'sortable'
};

/*
 * When the index of an item changes while sorting,
 * we need to temporarily disable the transforms
 */

function useDerivedTransform(_ref) {
  let {
    disabled,
    index,
    node,
    rect
  } = _ref;
  const [derivedTransform, setDerivedtransform] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const previousIndex = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(index);
  (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useIsomorphicLayoutEffect)(() => {
    if (!disabled && index !== previousIndex.current && node.current) {
      const initial = rect.current;

      if (initial) {
        const current = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.getClientRect)(node.current, {
          ignoreTransform: true
        });
        const delta = {
          x: initial.left - current.left,
          y: initial.top - current.top,
          scaleX: initial.width / current.width,
          scaleY: initial.height / current.height
        };

        if (delta.x || delta.y) {
          setDerivedtransform(delta);
        }
      }
    }

    if (index !== previousIndex.current) {
      previousIndex.current = index;
    }
  }, [disabled, index, node, rect]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (derivedTransform) {
      setDerivedtransform(null);
    }
  }, [derivedTransform]);
  return derivedTransform;
}

function useSortable(_ref) {
  let {
    animateLayoutChanges = defaultAnimateLayoutChanges,
    attributes: userDefinedAttributes,
    disabled: localDisabled,
    data: customData,
    getNewIndex = defaultNewIndexGetter,
    id,
    strategy: localStrategy,
    resizeObserverConfig,
    transition = defaultTransition
  } = _ref;
  const {
    items,
    containerId,
    activeIndex,
    disabled: globalDisabled,
    disableTransforms,
    sortedRects,
    overIndex,
    useDragOverlay,
    strategy: globalStrategy
  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context);
  const disabled = normalizeLocalDisabled(localDisabled, globalDisabled);
  const index = items.indexOf(id);
  const data = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => ({
    sortable: {
      containerId,
      index,
      items
    },
    ...customData
  }), [containerId, customData, index, items]);
  const itemsAfterCurrentSortable = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => items.slice(items.indexOf(id)), [items, id]);
  const {
    rect,
    node,
    isOver,
    setNodeRef: setDroppableNodeRef
  } = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.useDroppable)({
    id,
    data,
    disabled: disabled.droppable,
    resizeObserverConfig: {
      updateMeasurementsFor: itemsAfterCurrentSortable,
      ...resizeObserverConfig
    }
  });
  const {
    active,
    activatorEvent,
    activeNodeRect,
    attributes,
    setNodeRef: setDraggableNodeRef,
    listeners,
    isDragging,
    over,
    setActivatorNodeRef,
    transform
  } = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.useDraggable)({
    id,
    data,
    attributes: { ...defaultAttributes,
      ...userDefinedAttributes
    },
    disabled: disabled.draggable
  });
  const setNodeRef = (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.useCombinedRefs)(setDroppableNodeRef, setDraggableNodeRef);
  const isSorting = Boolean(active);
  const displaceItem = isSorting && !disableTransforms && isValidIndex(activeIndex) && isValidIndex(overIndex);
  const shouldDisplaceDragSource = !useDragOverlay && isDragging;
  const dragSourceDisplacement = shouldDisplaceDragSource && displaceItem ? transform : null;
  const strategy = localStrategy != null ? localStrategy : globalStrategy;
  const finalTransform = displaceItem ? dragSourceDisplacement != null ? dragSourceDisplacement : strategy({
    rects: sortedRects,
    activeNodeRect,
    activeIndex,
    overIndex,
    index
  }) : null;
  const newIndex = isValidIndex(activeIndex) && isValidIndex(overIndex) ? getNewIndex({
    id,
    items,
    activeIndex,
    overIndex
  }) : index;
  const activeId = active == null ? void 0 : active.id;
  const previous = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    activeId,
    items,
    newIndex,
    containerId
  });
  const itemsHaveChanged = items !== previous.current.items;
  const shouldAnimateLayoutChanges = animateLayoutChanges({
    active,
    containerId,
    isDragging,
    isSorting,
    id,
    index,
    items,
    newIndex: previous.current.newIndex,
    previousItems: previous.current.items,
    previousContainerId: previous.current.containerId,
    transition,
    wasDragging: previous.current.activeId != null
  });
  const derivedTransform = useDerivedTransform({
    disabled: !shouldAnimateLayoutChanges,
    index,
    node,
    rect
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isSorting && previous.current.newIndex !== newIndex) {
      previous.current.newIndex = newIndex;
    }

    if (containerId !== previous.current.containerId) {
      previous.current.containerId = containerId;
    }

    if (items !== previous.current.items) {
      previous.current.items = items;
    }
  }, [isSorting, newIndex, containerId, items]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (activeId === previous.current.activeId) {
      return;
    }

    if (activeId && !previous.current.activeId) {
      previous.current.activeId = activeId;
      return;
    }

    const timeoutId = setTimeout(() => {
      previous.current.activeId = activeId;
    }, 50);
    return () => clearTimeout(timeoutId);
  }, [activeId]);
  return {
    active,
    activeIndex,
    attributes,
    data,
    rect,
    index,
    newIndex,
    items,
    isOver,
    isSorting,
    isDragging,
    listeners,
    node,
    overIndex,
    over,
    setNodeRef,
    setActivatorNodeRef,
    setDroppableNodeRef,
    setDraggableNodeRef,
    transform: derivedTransform != null ? derivedTransform : finalTransform,
    transition: getTransition()
  };

  function getTransition() {
    if ( // Temporarily disable transitions for a single frame to set up derived transforms
    derivedTransform || // Or to prevent items jumping to back to their "new" position when items change
    itemsHaveChanged && previous.current.newIndex === index) {
      return disabledTransition;
    }

    if (shouldDisplaceDragSource && !(0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.isKeyboardEvent)(activatorEvent) || !transition) {
      return undefined;
    }

    if (isSorting || shouldAnimateLayoutChanges) {
      return _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.CSS.Transition.toString({ ...transition,
        property: transitionProperty
      });
    }

    return undefined;
  }
}

function normalizeLocalDisabled(localDisabled, globalDisabled) {
  var _localDisabled$dragga, _localDisabled$droppa;

  if (typeof localDisabled === 'boolean') {
    return {
      draggable: localDisabled,
      // Backwards compatibility
      droppable: false
    };
  }

  return {
    draggable: (_localDisabled$dragga = localDisabled == null ? void 0 : localDisabled.draggable) != null ? _localDisabled$dragga : globalDisabled.draggable,
    droppable: (_localDisabled$droppa = localDisabled == null ? void 0 : localDisabled.droppable) != null ? _localDisabled$droppa : globalDisabled.droppable
  };
}

function hasSortableData(entry) {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data && 'sortable' in data && typeof data.sortable === 'object' && 'containerId' in data.sortable && 'items' in data.sortable && 'index' in data.sortable) {
    return true;
  }

  return false;
}

const directions = [_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Down, _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Right, _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Up, _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Left];
const sortableKeyboardCoordinates = (event, _ref) => {
  let {
    context: {
      active,
      collisionRect,
      droppableRects,
      droppableContainers,
      over,
      scrollableAncestors
    }
  } = _ref;

  if (directions.includes(event.code)) {
    event.preventDefault();

    if (!active || !collisionRect) {
      return;
    }

    const filteredContainers = [];
    droppableContainers.getEnabled().forEach(entry => {
      if (!entry || entry != null && entry.disabled) {
        return;
      }

      const rect = droppableRects.get(entry.id);

      if (!rect) {
        return;
      }

      switch (event.code) {
        case _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Down:
          if (collisionRect.top < rect.top) {
            filteredContainers.push(entry);
          }

          break;

        case _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Up:
          if (collisionRect.top > rect.top) {
            filteredContainers.push(entry);
          }

          break;

        case _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Left:
          if (collisionRect.left > rect.left) {
            filteredContainers.push(entry);
          }

          break;

        case _dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.KeyboardCode.Right:
          if (collisionRect.left < rect.left) {
            filteredContainers.push(entry);
          }

          break;
      }
    });
    const collisions = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.closestCorners)({
      active,
      collisionRect: collisionRect,
      droppableRects,
      droppableContainers: filteredContainers,
      pointerCoordinates: null
    });
    let closestId = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.getFirstCollision)(collisions, 'id');

    if (closestId === (over == null ? void 0 : over.id) && collisions.length > 1) {
      closestId = collisions[1].id;
    }

    if (closestId != null) {
      const activeDroppable = droppableContainers.get(active.id);
      const newDroppable = droppableContainers.get(closestId);
      const newRect = newDroppable ? droppableRects.get(newDroppable.id) : null;
      const newNode = newDroppable == null ? void 0 : newDroppable.node.current;

      if (newNode && newRect && activeDroppable && newDroppable) {
        const newScrollAncestors = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_1__.getScrollableAncestors)(newNode);
        const hasDifferentScrollAncestors = newScrollAncestors.some((element, index) => scrollableAncestors[index] !== element);
        const hasSameContainer = isSameContainer(activeDroppable, newDroppable);
        const isAfterActive = isAfter(activeDroppable, newDroppable);
        const offset = hasDifferentScrollAncestors || !hasSameContainer ? {
          x: 0,
          y: 0
        } : {
          x: isAfterActive ? collisionRect.width - newRect.width : 0,
          y: isAfterActive ? collisionRect.height - newRect.height : 0
        };
        const rectCoordinates = {
          x: newRect.left,
          y: newRect.top
        };
        const newCoordinates = offset.x && offset.y ? rectCoordinates : (0,_dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_2__.subtract)(rectCoordinates, offset);
        return newCoordinates;
      }
    }
  }

  return undefined;
};

function isSameContainer(a, b) {
  if (!hasSortableData(a) || !hasSortableData(b)) {
    return false;
  }

  return a.data.current.sortable.containerId === b.data.current.sortable.containerId;
}

function isAfter(a, b) {
  if (!hasSortableData(a) || !hasSortableData(b)) {
    return false;
  }

  if (!isSameContainer(a, b)) {
    return false;
  }

  return a.data.current.sortable.index < b.data.current.sortable.index;
}


//# sourceMappingURL=sortable.esm.js.map


/***/ }),

/***/ "./node_modules/@dnd-kit/utilities/dist/utilities.esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@dnd-kit/utilities/dist/utilities.esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CSS": () => (/* binding */ CSS),
/* harmony export */   "add": () => (/* binding */ add),
/* harmony export */   "canUseDOM": () => (/* binding */ canUseDOM),
/* harmony export */   "findFirstFocusableNode": () => (/* binding */ findFirstFocusableNode),
/* harmony export */   "getEventCoordinates": () => (/* binding */ getEventCoordinates),
/* harmony export */   "getOwnerDocument": () => (/* binding */ getOwnerDocument),
/* harmony export */   "getWindow": () => (/* binding */ getWindow),
/* harmony export */   "hasViewportRelativeCoordinates": () => (/* binding */ hasViewportRelativeCoordinates),
/* harmony export */   "isDocument": () => (/* binding */ isDocument),
/* harmony export */   "isHTMLElement": () => (/* binding */ isHTMLElement),
/* harmony export */   "isKeyboardEvent": () => (/* binding */ isKeyboardEvent),
/* harmony export */   "isNode": () => (/* binding */ isNode),
/* harmony export */   "isSVGElement": () => (/* binding */ isSVGElement),
/* harmony export */   "isTouchEvent": () => (/* binding */ isTouchEvent),
/* harmony export */   "isWindow": () => (/* binding */ isWindow),
/* harmony export */   "subtract": () => (/* binding */ subtract),
/* harmony export */   "useCombinedRefs": () => (/* binding */ useCombinedRefs),
/* harmony export */   "useEvent": () => (/* binding */ useEvent),
/* harmony export */   "useInterval": () => (/* binding */ useInterval),
/* harmony export */   "useIsomorphicLayoutEffect": () => (/* binding */ useIsomorphicLayoutEffect),
/* harmony export */   "useLatestValue": () => (/* binding */ useLatestValue),
/* harmony export */   "useLazyMemo": () => (/* binding */ useLazyMemo),
/* harmony export */   "useNodeRef": () => (/* binding */ useNodeRef),
/* harmony export */   "usePrevious": () => (/* binding */ usePrevious),
/* harmony export */   "useUniqueId": () => (/* binding */ useUniqueId)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function useCombinedRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => node => {
    refs.forEach(ref => ref(node));
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  refs);
}

// https://github.com/facebook/react/blob/master/packages/shared/ExecutionEnvironment.js
const canUseDOM = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined';

function isWindow(element) {
  const elementString = Object.prototype.toString.call(element);
  return elementString === '[object Window]' || // In Electron context the Window object serializes to [object global]
  elementString === '[object global]';
}

function isNode(node) {
  return 'nodeType' in node;
}

function getWindow(target) {
  var _target$ownerDocument, _target$ownerDocument2;

  if (!target) {
    return window;
  }

  if (isWindow(target)) {
    return target;
  }

  if (!isNode(target)) {
    return window;
  }

  return (_target$ownerDocument = (_target$ownerDocument2 = target.ownerDocument) == null ? void 0 : _target$ownerDocument2.defaultView) != null ? _target$ownerDocument : window;
}

function isDocument(node) {
  const {
    Document
  } = getWindow(node);
  return node instanceof Document;
}

function isHTMLElement(node) {
  if (isWindow(node)) {
    return false;
  }

  return node instanceof getWindow(node).HTMLElement;
}

function isSVGElement(node) {
  return node instanceof getWindow(node).SVGElement;
}

function getOwnerDocument(target) {
  if (!target) {
    return document;
  }

  if (isWindow(target)) {
    return target.document;
  }

  if (!isNode(target)) {
    return document;
  }

  if (isDocument(target)) {
    return target;
  }

  if (isHTMLElement(target)) {
    return target.ownerDocument;
  }

  return document;
}

/**
 * A hook that resolves to useEffect on the server and useLayoutEffect on the client
 * @param callback {function} Callback function that is invoked when the dependencies of the hook change
 */

const useIsomorphicLayoutEffect = canUseDOM ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

function useEvent(handler) {
  const handlerRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(handler);
  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler;
  });
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return handlerRef.current == null ? void 0 : handlerRef.current(...args);
  }, []);
}

function useInterval() {
  const intervalRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const set = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)((listener, duration) => {
    intervalRef.current = setInterval(listener, duration);
  }, []);
  const clear = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
  return [set, clear];
}

function useLatestValue(value, dependencies) {
  if (dependencies === void 0) {
    dependencies = [value];
  }

  const valueRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(value);
  useIsomorphicLayoutEffect(() => {
    if (valueRef.current !== value) {
      valueRef.current = value;
    }
  }, dependencies);
  return valueRef;
}

function useLazyMemo(callback, dependencies) {
  const valueRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    const newValue = callback(valueRef.current);
    valueRef.current = newValue;
    return newValue;
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [...dependencies]);
}

function useNodeRef(onChange) {
  const onChangeHandler = useEvent(onChange);
  const node = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const setNodeRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(element => {
    if (element !== node.current) {
      onChangeHandler == null ? void 0 : onChangeHandler(element, node.current);
    }

    node.current = element;
  }, //eslint-disable-next-line
  []);
  return [node, setNodeRef];
}

function usePrevious(value) {
  const ref = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

let ids = {};
function useUniqueId(prefix, value) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (value) {
      return value;
    }

    const id = ids[prefix] == null ? 0 : ids[prefix] + 1;
    ids[prefix] = id;
    return prefix + "-" + id;
  }, [prefix, value]);
}

function createAdjustmentFn(modifier) {
  return function (object) {
    for (var _len = arguments.length, adjustments = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      adjustments[_key - 1] = arguments[_key];
    }

    return adjustments.reduce((accumulator, adjustment) => {
      const entries = Object.entries(adjustment);

      for (const [key, valueAdjustment] of entries) {
        const value = accumulator[key];

        if (value != null) {
          accumulator[key] = value + modifier * valueAdjustment;
        }
      }

      return accumulator;
    }, { ...object
    });
  };
}

const add = /*#__PURE__*/createAdjustmentFn(1);
const subtract = /*#__PURE__*/createAdjustmentFn(-1);

function hasViewportRelativeCoordinates(event) {
  return 'clientX' in event && 'clientY' in event;
}

function isKeyboardEvent(event) {
  if (!event) {
    return false;
  }

  const {
    KeyboardEvent
  } = getWindow(event.target);
  return KeyboardEvent && event instanceof KeyboardEvent;
}

function isTouchEvent(event) {
  if (!event) {
    return false;
  }

  const {
    TouchEvent
  } = getWindow(event.target);
  return TouchEvent && event instanceof TouchEvent;
}

/**
 * Returns the normalized x and y coordinates for mouse and touch events.
 */

function getEventCoordinates(event) {
  if (isTouchEvent(event)) {
    if (event.touches && event.touches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.touches[0];
      return {
        x,
        y
      };
    } else if (event.changedTouches && event.changedTouches.length) {
      const {
        clientX: x,
        clientY: y
      } = event.changedTouches[0];
      return {
        x,
        y
      };
    }
  }

  if (hasViewportRelativeCoordinates(event)) {
    return {
      x: event.clientX,
      y: event.clientY
    };
  }

  return null;
}

const CSS = /*#__PURE__*/Object.freeze({
  Translate: {
    toString(transform) {
      if (!transform) {
        return;
      }

      const {
        x,
        y
      } = transform;
      return "translate3d(" + (x ? Math.round(x) : 0) + "px, " + (y ? Math.round(y) : 0) + "px, 0)";
    }

  },
  Scale: {
    toString(transform) {
      if (!transform) {
        return;
      }

      const {
        scaleX,
        scaleY
      } = transform;
      return "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    }

  },
  Transform: {
    toString(transform) {
      if (!transform) {
        return;
      }

      return [CSS.Translate.toString(transform), CSS.Scale.toString(transform)].join(' ');
    }

  },
  Transition: {
    toString(_ref) {
      let {
        property,
        duration,
        easing
      } = _ref;
      return property + " " + duration + "ms " + easing;
    }

  }
});

const SELECTOR = 'a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]';
function findFirstFocusableNode(element) {
  if (element.matches(SELECTOR)) {
    return element;
  }

  return element.querySelector(SELECTOR);
}


//# sourceMappingURL=utilities.esm.js.map


/***/ }),

/***/ "./src/admin/panelExtras.tsx":
/*!***********************************!*\
  !*** ./src/admin/panelExtras.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AnimationAdvancedControls": () => (/* binding */ AnimationAdvancedControls)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/compose */ "@wordpress/compose");
/* harmony import */ var _wordpress_compose__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils_fn__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/fn */ "./src/utils/fn.ts");
/* harmony import */ var _components_ActionList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/ActionList */ "./src/components/ActionList.tsx");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/data */ "./src/utils/data.ts");










/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {Function} BlockEdit Block edit component.
 *
 * @return {Function} BlockEdit Modified block edit component.
 */
const AnimationAdvancedControls = (0,_wordpress_compose__WEBPACK_IMPORTED_MODULE_2__.createHigherOrderComponent)(BlockEdit => {
  return props => {
    const {
      name,
      setAttributes,
      isSelected,
      attributes: {
        ssc
      }
    } = props;
    const {
      sscAnimated = false,
      sscAnimationType = false,
      sscAnimationOptions = {}
    } = ssc;

    /**
     * Set the animation options
     *
     * @param    {Object|boolean} data - the data to store
     * @param    {string}         prop - the property
     *
     * @typedef {Object} sscAnimationOptions
     * @property {Object}         type - the type of animation (each animation has its own set of default parameters)
     *
     */
    const setOption = (data, prop) => {
      setAttributes({
        ssc: {
          ...ssc,
          sscAnimationOptions: {
            ...ssc.sscAnimationOptions,
            [prop]: data
          }
        }
      });
    };

    /**
     * The function `pullScene` takes a single argument, `data`,
     * and uses the `setOption` function to set the value of the `scene` option
     * to the value of the `sscSequence` property of the `data` object
     *
     * @param {Object} data - The data object that contains the animation sequence
     *
     * @type {data}
     */
    function pullScene(data) {
      setOption(data, 'scene');
    }

    /**
     * Updates the selected item animation settings
     *
     * `updateAnimation` is a function that takes the type of animation and
     * sets the default attributes if none have been set previously
     *
     * @param {string} type            - The attribute type chosen by the user
     * @param {Object} additionalProps - props to be added to the animation
     *
     * @type {sscAnimationOptions|null}
     */
    function updateAnimation(type) {
      let additionalProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (type === sscAnimationType) return null;
      const defaultOptions = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_5__.getDefaults)(type);

      // get default options if the animation isn't initialized
      setAttributes({
        ssc: {
          ...ssc,
          sscAnimationType: type,
          sscAnimationOptions: defaultOptions,
          // the default values for this animation
          ...additionalProps
        }
      });
    }

    /**
     * Then Enable the animation and provides default options if empty
     */
    const toggleAnimated = () => {
      // If the animation settings aren't set, set the default.
      if (ssc?.sscAnimated !== true) {
        updateAnimation('sscAnimation', {
          sscAnimated: !sscAnimated
        });
      }
    };
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(BlockEdit, props), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
      initialOpen: true,
      icon: "visibility",
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Screen Control')
    }, isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl
    // ENABLE ANIMATION
    , {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Animated'),
      checked: sscAnimated,
      onChange: toggleAnimated,
      help: !!sscAnimated ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Please choose an animation from the select input below.') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Not Animated.')
    }), sscAnimated && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Choose an animation type for ' + name.split('/').pop(),
      value: sscAnimationType,
      options: _utils_data__WEBPACK_IMPORTED_MODULE_7__.animationTypes,
      onChange: newType => updateAnimation(newType)
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reiterate'),
      checked: sscAnimationOptions?.reiterate || true,
      onChange: () => setOption(!sscAnimationOptions.reiterate, 'reiterate')
    }), sscAnimationType && ['sscSvgPath', 'sscSequence', 'sscScrollJacking', 'sscCounter', 'sscTextStagger', 'sscAnimation', 'sscTimelineChild'].includes(sscAnimationType) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Delay (ms)'),
      value: sscAnimationOptions.delay,
      onChange: e => setOption(e, 'delay'),
      min: 0,
      max: 10000,
      step: 10
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Duration (ms)'),
      value: sscAnimationOptions.duration,
      onChange: e => setOption(e, 'duration'),
      min: 0,
      max: 10000,
      step: 10
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Easing',
      value: sscAnimationOptions.easing,
      options: sscAnimationType !== 'sscAnimation' ? _utils_data__WEBPACK_IMPORTED_MODULE_7__.animationEasings : _utils_data__WEBPACK_IMPORTED_MODULE_7__.cssAnimationsEasings,
      onChange: e => setOption(e, 'easing')
    })), sscAnimationType === 'sscSequence' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_ActionList__WEBPACK_IMPORTED_MODULE_6__.ActionList, {
      data: sscAnimationOptions.scene,
      type: sscAnimationType,
      onSave: pullScene
    }), sscAnimationType === 'ssc360' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: 'Spin ratio',
      type: 'number',
      value: sscAnimationOptions.spinRatio || 1,
      onChange: e => setOption(e, 'spinRatio')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Controls',
      value: sscAnimationOptions.control,
      onChange: e => setOption(e, 'control'),
      options: [{
        label: 'Pointer position',
        value: 'pointer'
      }, {
        label: 'Drag',
        value: 'drag'
      }]
    })), ['sscVideoParallax', 'sscVideoScroll'].includes(sscAnimationType) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: 'Playback Ratio',
      description: 'the mouse wheel speed playback speed',
      type: 'number',
      value: sscAnimationOptions.playbackRatio || 1,
      min: 0,
      max: 10,
      step: 0.1,
      onChange: e => setOption(e, 'playbackRatio')
    })), sscAnimationType === 'sscParallax' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: 'The speed of the parallaxed object (expressed in pixels - negative value enabled)',
      type: 'number',
      value: sscAnimationOptions.speed,
      onChange: e => setOption(e, 'speed')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Direction',
      value: sscAnimationOptions.direction,
      onChange: e => setOption(e, 'direction'),
      options: [{
        label: 'vertical',
        value: 'y'
      }, {
        label: 'horizontal',
        value: 'x'
      }]
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: 'Level',
      type: 'number',
      value: sscAnimationOptions.level,
      onChange: e => setOption(e, 'level')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
      label: 'Motion (in ms)',
      type: 'number',
      value: sscAnimationOptions.motion,
      onChange: e => setOption(e, 'motion')
    })), sscAnimationType === 'sscAnimation' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Entering animation name',
      options: _utils_data__WEBPACK_IMPORTED_MODULE_7__.animationList,
      value: sscAnimationOptions.animationEnter,
      onChange: e => setOption(e, 'animationEnter')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Exiting animation name (checkout animate.css)',
      options: _utils_data__WEBPACK_IMPORTED_MODULE_7__.animationList,
      value: sscAnimationOptions.animationLeave,
      onChange: e => setOption(e, 'animationLeave')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Stagger',
      value: sscAnimationOptions.stagger,
      onChange: e => setOption(e, 'stagger'),
      options: [{
        label: 'none',
        value: 'none'
      }, {
        label: 'Elements',
        value: 'elements'
      }, {
        label: 'Letter',
        value: 'letter'
      }, {
        label: 'Word',
        value: 'word'
      }]
    })), sscAnimationType === 'sscTextStagger' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'preset',
      options: _utils_data__WEBPACK_IMPORTED_MODULE_7__.textStaggerPresetsNames,
      value: sscAnimationOptions.preset,
      onChange: e => setOption(e, 'preset')
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Split by',
      value: sscAnimationOptions.splitBy,
      onChange: e => setOption(e, 'splitBy'),
      options: [{
        label: 'Letter',
        value: 'letter'
      }, {
        label: 'Word',
        value: 'word'
      }]
    })), sscAnimationType && ['sscSvgPath', 'sscSequence', 'sscAnimation', 'sscScrollJacking', 'sscTextStagger'].includes(sscAnimationType) && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: 'Viewport Minimum Active Zone (%)',
      type: 'number',
      value: sscAnimationOptions.intersection || 80,
      onChange: e => setOption(e, 'intersection')
    })), sscAnimationType === 'sscCounter' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Target',
      value: sscAnimationOptions.target,
      onChange: e => setOption(e, 'target'),
      options: [{
        label: 'Number',
        value: 'number'
      }, {
        label: 'Word',
        value: 'word'
      }]
    }), sscAnimationType === 'sscScreenJump' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
      label: 'Target',
      value: sscAnimationOptions.target,
      onChange: e => setOption(e, 'target'),
      options: [{
        label: 'Next View',
        value: 'none'
      }, {
        label: 'Anchor',
        value: 'anchor'
      }]
    }), sscAnimationType === 'sscScrollTimeline' && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: 'Duration (height in px)',
      type: 'number',
      value: sscAnimationOptions.duration,
      onChange: e => setOption(e, 'duration'),
      min: 100,
      step: 10,
      max: 10000
    }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
      label: 'triggerHook (0:top - 1:bottom)',
      type: 'number',
      value: sscAnimationOptions.triggerHook,
      onChange: e => setOption(e, 'triggerHook'),
      min: 0,
      step: 0.01,
      max: 1
    })))))));
  };
}, 'withAdvancedControls');

/***/ }),

/***/ "./src/blockAttributes.ts":
/*!********************************!*\
  !*** ./src/blockAttributes.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addAttributes": () => (/* binding */ addAttributes)
/* harmony export */ });
/**
 * The ssc additional panel settings.
 *
 * @param {Object} settings            Settings for the block.
 *
 * @param          settings.attributes
 * @return {Object} settings Modified settings.
 */
function addAttributes(settings) {
  //check if object exists for old Gutenberg version compatibility
  //add allowedBlocks restriction
  if (typeof settings.attributes !== 'undefined') {
    settings.attributes = Object.assign(settings.attributes, {
      ssc: {
        type: 'object',
        default: {}
      }
    });
  }
  return settings;
}

/***/ }),

/***/ "./src/components/ActionList.tsx":
/*!***************************************!*\
  !*** ./src/components/ActionList.tsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ActionList": () => (/* binding */ ActionList)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @dnd-kit/core */ "./node_modules/@dnd-kit/core/dist/core.esm.js");
/* harmony import */ var _dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @dnd-kit/sortable */ "./node_modules/@dnd-kit/sortable/dist/sortable.esm.js");
/* harmony import */ var _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @dnd-kit/utilities */ "./node_modules/@dnd-kit/utilities/dist/utilities.esm.js");
/* harmony import */ var _utils_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/data */ "./src/utils/data.ts");







class sscPointerSensor extends _dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.PointerSensor {
  static activators = [{
    eventName: 'onPointerDown',
    handler: _ref => {
      let {
        nativeEvent: event
      } = _ref;
      if (!event.isPrimary || event.button !== 0 || isInteractiveElement(event.target)) {
        return false;
      }
      return true;
    }
  }];
}
function isInteractiveElement(element) {
  const interactiveElements = ['button', 'input', 'textarea', 'select', 'option', 'span'];
  return interactiveElements.includes(element.tagName.toLowerCase());
}
const HandleIcon = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)('svg', {
  width: 20,
  height: 20,
  color: '#666'
}, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)('path', {
  d: 'M7.542 16.667Q6.833 16.667 6.333 16.167Q5.833 15.667 5.833 14.958Q5.833 14.25 6.333 13.75Q6.833 13.25 7.542 13.25Q8.25 13.25 8.75 13.75Q9.25 14.25 9.25 14.958Q9.25 15.667 8.75 16.167Q8.25 16.667 7.542 16.667ZM7.542 11.708Q6.833 11.708 6.333 11.208Q5.833 10.708 5.833 10Q5.833 9.292 6.333 8.792Q6.833 8.292 7.542 8.292Q8.25 8.292 8.75 8.792Q9.25 9.292 9.25 10Q9.25 10.708 8.75 11.208Q8.25 11.708 7.542 11.708ZM7.542 6.75Q6.833 6.75 6.333 6.25Q5.833 5.75 5.833 5.042Q5.833 4.333 6.333 3.833Q6.833 3.333 7.542 3.333Q8.25 3.333 8.75 3.833Q9.25 4.333 9.25 5.042Q9.25 5.75 8.75 6.25Q8.25 6.75 7.542 6.75ZM12.458 6.75Q11.75 6.75 11.25 6.25Q10.75 5.75 10.75 5.042Q10.75 4.333 11.25 3.833Q11.75 3.333 12.458 3.333Q13.167 3.333 13.667 3.833Q14.167 4.333 14.167 5.042Q14.167 5.75 13.667 6.25Q13.167 6.75 12.458 6.75ZM12.458 11.708Q11.75 11.708 11.25 11.208Q10.75 10.708 10.75 10Q10.75 9.292 11.25 8.792Q11.75 8.292 12.458 8.292Q13.167 8.292 13.667 8.792Q14.167 9.292 14.167 10Q14.167 10.708 13.667 11.208Q13.167 11.708 12.458 11.708ZM12.458 16.667Q11.75 16.667 11.25 16.167Q10.75 15.667 10.75 14.958Q10.75 14.25 11.25 13.75Q11.75 13.25 12.458 13.25Q13.167 13.25 13.667 13.75Q14.167 14.25 14.167 14.958Q14.167 15.667 13.667 16.167Q13.167 16.667 12.458 16.667Z'
}));
function ActionRow(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = (0,_dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__.useSortable)({
    id: props.id
  });
  const style = {
    transform: _dnd_kit_utilities__WEBPACK_IMPORTED_MODULE_5__.CSS.Transform.toString(transform),
    transition
  };
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
    className: 'ssc-row ' + props.action,
    ref: setNodeRef,
    style: style
  }, attributes, listeners), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Icon, {
    icon: HandleIcon
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("div", {
    className: 'col'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.SelectControl, {
    name: 'action',
    value: props.action,
    options: props.actionList,
    id: props.id + '-action',
    onChange: e => props.handleChange(e, {
      id: props.id,
      changed: 'action',
      action: props.action,
      value: props.value
    })
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
    name: 'value',
    value: props.value,
    id: props.id + '-value',
    onChange: e => props.handleChange(e, {
      id: props.id,
      changed: 'value',
      action: props.action,
      value: props.value
    })
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    icon: 'remove',
    onClick: () => props.removeAction(props.id)
  }));
}
function ActionList(props) {
  const [animationProps, setAnimationProps] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(props.data || []);
  const sensors = (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.useSensors)((0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.useSensor)(sscPointerSensor), (0,_dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.useSensor)(_dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.KeyboardSensor, {
    coordinateGetter: _dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__.sortableKeyboardCoordinates
  }));
  const provideSelectOptions = (array, label, value) => {
    return array.map(item => {
      return {
        label: item[label],
        value: item[value]
      };
    });
  };
  const wrapperStyle = {
    margin: '24px 0',
    position: 'relative'
  };
  function handleDragEnd(event) {
    const {
      active,
      over
    } = event;
    if (active.id !== over.id) {
      setAnimationProps(items => {
        const oldIndex = items.map(o => o.id).indexOf(active.id);
        const newIndex = items.map(x => x.id).indexOf(over.id);
        return (0,_dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__.arrayMove)(items, oldIndex, newIndex);
      });
      props.onSave(animationProps);
    }
  }
  const addAction = () => {
    const newID = animationProps.length ? Math.max(...animationProps.map(x => x.id)) + 1 : 1;
    setAnimationProps([...animationProps.concat({
      id: newID,
      key: newID,
      action: _utils_data__WEBPACK_IMPORTED_MODULE_6__.actionsTemplate[0].action,
      value: _utils_data__WEBPACK_IMPORTED_MODULE_6__.actionsTemplate[0].valueDefault
    })]);
    props.onSave(animationProps);
  };
  function removeAction(id) {
    const selectedItem = animationProps.map(x => x.id).indexOf(id);
    const newAnimationProps = [...animationProps.slice(0, selectedItem), ...animationProps.slice(selectedItem + 1)];
    setAnimationProps([...newAnimationProps]);
    props.onSave(newAnimationProps);
  }
  function handleChange(ev, data) {
    const newAnimationProps = animationProps;
    const selectedItem = animationProps.map(x => x.id).indexOf(data.id);
    if (data.changed === 'action') {
      newAnimationProps[selectedItem].action = ev;
      newAnimationProps[selectedItem].value = _utils_data__WEBPACK_IMPORTED_MODULE_6__.actionsTemplate.find(item => item.action === ev).valueDefault;
    } else if (data.changed === 'value') {
      newAnimationProps[selectedItem].value = ev;
    }
    setAnimationProps([...newAnimationProps]);
    props.onSave(newAnimationProps);
  }
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("section", {
    className: 'action-sequence'
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)("p", null, "Action Sequence"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.DndContext, {
    sensors: sensors,
    collisionDetection: _dnd_kit_core__WEBPACK_IMPORTED_MODULE_3__.closestCenter,
    onDragEnd: handleDragEnd,
    style: wrapperStyle
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__.SortableContext, {
    items: animationProps,
    strategy: _dnd_kit_sortable__WEBPACK_IMPORTED_MODULE_4__.verticalListSortingStrategy
  }, animationProps.map(action => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(ActionRow, {
    className: "ssc-row",
    key: action.key,
    id: action.id,
    action: action.action,
    value: action.value || action.defaultValue,
    actionList: provideSelectOptions(_utils_data__WEBPACK_IMPORTED_MODULE_6__.actionsTemplate, 'actionLabel', 'action'),
    style: {
      display: 'flex'
    },
    removeAction: removeAction,
    handleChange: handleChange
  })))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
    onClick: addAction,
    icon: 'insert',
    variant: 'secondary',
    className: 'add-new'
  }, "Add action"));
}

/***/ }),

/***/ "./src/save.ts":
/*!*********************!*\
  !*** ./src/save.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addExtraProps": () => (/* binding */ addExtraProps)
/* harmony export */ });
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! classnames */ "./node_modules/classnames/index.js");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_fn__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/fn */ "./src/utils/fn.ts");



/**
 * I know this is not the save function but is a hook to change some data before
 * Add custom dataset to element before save.
 *
 * @param {Object} extraProps Block element.
 * @param {Object} blockType  Blocks object.
 * @param {Object} attributes Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
const addExtraProps = (extraProps, blockType, attributes) => {
  const {
    sscAnimated,
    sscAnimationType,
    sscAnimationOptions
  } = attributes.ssc;
  const classes = [];
  if (!!sscAnimated && sscAnimationType) {
    const defaults = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_1__.getDefaults)(sscAnimationType);
    const animationOptions = {
      ...defaults,
      ...sscAnimationOptions
    };

    // this adds to the dataset sscAnimation="theTypeOfAnimation"
    extraProps['data-ssc-animation'] = sscAnimationType;
    if (Object.keys(animationOptions).length) {
      extraProps['data-ssc-props'] = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_1__.dataStringify)(animationOptions, sscAnimationType);
    }
    if (sscAnimationType === 'sscTimelineChild' && animationOptions?.scene) {
      try {
        extraProps['data-scene'] = JSON.stringify(animationOptions.scene, null, null);
      } catch (err) {
        extraProps['data-scene'] = '';
      }
    }
    if (sscAnimationType === 'sscScreenJump') {
      extraProps['data-ssc-jumper-target'] = animationOptions.target || 'none';
    }

    // map the original array into a single key value object
    if (sscAnimationType === 'sscSequence') {
      const selected = animationOptions.scene || false;
      if (selected && Object.keys(animationOptions).length) {
        extraProps['data-ssc-sequence'] = (0,_utils_fn__WEBPACK_IMPORTED_MODULE_1__.dataStringify)(selected, 'sequence');
      }
    }
    classes.push('ssc');
    classes.push((0,_utils_fn__WEBPACK_IMPORTED_MODULE_1__.capitalToloDash)(sscAnimationType));
  }

  // add all the custom properties to the element
  Object.assign(extraProps, {
    className: classnames__WEBPACK_IMPORTED_MODULE_0___default()(extraProps.className, classes)
  });
  return extraProps;
};

/***/ }),

/***/ "./src/utils/data.ts":
/*!***************************!*\
  !*** ./src/utils/data.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "actionsTemplate": () => (/* binding */ actionsTemplate),
/* harmony export */   "animationEasings": () => (/* binding */ animationEasings),
/* harmony export */   "animationList": () => (/* binding */ animationList),
/* harmony export */   "animationTypes": () => (/* binding */ animationTypes),
/* harmony export */   "cssAnimationsEasings": () => (/* binding */ cssAnimationsEasings),
/* harmony export */   "textStaggerPresets": () => (/* binding */ textStaggerPresets),
/* harmony export */   "textStaggerPresetsNames": () => (/* binding */ textStaggerPresetsNames)
/* harmony export */ });
/** the advanced animation available parameters and defaults  */
const actionsTemplate = [{
  actionLabel: 'Keyframe (duration in ms)',
  action: 'duration',
  valueType: 'int',
  valueDefault: '500'
}, {
  actionLabel: 'Opacity',
  action: 'opacity',
  valueType: 'int',
  valueDefault: '1'
}, {
  actionLabel: 'translateY',
  action: 'translateY',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'translateX',
  action: 'translateX',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'translateZ',
  action: 'translateZ',
  valueType: 'string',
  valueDefault: '100px'
}, {
  actionLabel: 'Rotate',
  action: 'rotate',
  valueType: 'string',
  valueDefault: '45deg'
}, {
  actionLabel: 'rotateY',
  action: 'rotateY',
  valueType: 'string',
  valueDefault: '45deg'
}, {
  actionLabel: 'rotateX',
  action: 'rotateX',
  valueType: 'string',
  valueDefault: '45deg'
}, {
  actionLabel: 'rotateZ',
  action: 'rotateZ',
  valueType: 'string',
  valueDefault: '45deg'
}, {
  actionLabel: 'Scale',
  action: 'scale',
  valueType: 'number',
  valueDefault: '1.5'
}, {
  actionLabel: 'Background',
  action: 'background',
  valueType: 'color',
  valueDefault: '#000'
}, {
  actionLabel: 'Color',
  action: 'color',
  valueType: 'color',
  valueDefault: '#f00'
}, {
  actionLabel: 'CSS Animation',
  action: 'cssAnimation',
  valueType: 'string',
  valueDefault: 'fadeIn 5s linear 2s infinite alternate'
}];
const cssAnimationsEasings = [{
  label: 'Linear',
  value: 'linear'
}, {
  label: 'Ease',
  value: 'ease'
}, {
  label: 'Ease-in',
  value: 'ease-in'
}, {
  label: 'Ease-out',
  value: 'ease-out'
}, {
  label: 'Ease-in-out',
  value: 'ease-in-out'
}];
const animationEasings = [{
  label: 'Linear',
  value: 'linear'
}, {
  label: 'Elastic (low)',
  value: 'easeInElastic(1, .3)'
}, {
  label: 'Elastic (mid)',
  value: 'easeInElastic(1, .6)'
}, {
  label: 'Elastic (high)',
  value: 'easeInElastic(2, 1)'
}, {
  label: 'easeInQuad',
  value: 'easeInQuad'
}, {
  label: 'easeOutQuad',
  value: 'easeOutQuad'
}, {
  label: 'easeInOutQuad',
  value: 'easeInOutQuad'
}, {
  label: 'easeOutInQuad',
  value: 'easeOutInQuad'
}, {
  label: 'easeInCubic',
  value: 'easeInCubic'
}, {
  label: 'easeOutCubic',
  value: 'easeOutCubic'
}, {
  label: 'easeInOutCubic',
  value: 'easeInOutCubic'
}, {
  label: 'easeOutInCubic',
  value: 'easeOutInCubic'
}, {
  label: 'easeInSine',
  value: 'easeInSine'
}, {
  label: 'easeOutSine',
  value: 'easeOutSine'
}, {
  label: 'easeInOutSine',
  value: 'easeInOutSine'
}, {
  label: 'easeOutInSine',
  value: 'easeOutInSine'
}, {
  label: 'easeInExpo',
  value: 'easeInExpo'
}, {
  label: 'easeOutExpo',
  value: 'easeOutExpo'
}, {
  label: 'easeInOutExpo',
  value: 'easeInOutExpo'
}, {
  label: 'easeOutInExpo',
  value: 'easeOutInExpo'
}];
const animationTypes = [{
  label: 'Animation',
  value: 'sscAnimation',
  default: {
    animationEnter: 'fadeIn',
    animationLeave: 'fadeOut',
    intersection: 75,
    easing: 'linear',
    duration: 0,
    delay: 0,
    reiterate: true,
    stagger: 'none'
  }
}, {
  label: 'Parallax',
  value: 'sscParallax',
  default: {
    direction: 'y',
    level: 1,
    speed: 1,
    motion: 50,
    reiterate: true
  }
}, {
  label: 'Scroll Timeline',
  value: 'sscScrollTimeline',
  default: {
    duration: 400,
    triggerHook: 0.2,
    reiterate: true
  }
}, {
  label: 'Scroll Timeline child',
  value: 'sscTimelineChild',
  default: {
    offset: 0,
    delay: 0,
    duration: 1000,
    reiterate: true,
    easing: 'linear'
  }
}, {
  label: 'Image 360',
  value: 'ssc360',
  default: {
    spinRatio: 1,
    control: 'pointer',
    // drag
    reiterate: true
  }
}, {
  label: 'Image Zoom',
  value: 'sscImageZoom',
  default: {
    zoom: 1,
    reiterate: true
  }
}, {
  label: 'Video scroll-driven playback',
  value: 'sscVideoScroll',
  default: {
    playbackRatio: 1,
    reiterate: true
  }
}, {
  label: 'Video Parallax',
  value: 'sscVideoParallax',
  default: {
    playbackRatio: 1,
    reiterate: true
  }
}, {
  label: 'Video play on screen',
  value: 'sscVideoFocusPlay',
  default: {
    reiterate: true
  }
}, {
  label: 'Svg Path Animation',
  value: 'sscSvgPath',
  default: {
    duration: 5000,
    delay: 500,
    intersection: 80,
    reiterate: true,
    easing: 'easeInOutExpo'
  }
}, {
  label: 'Custom animation',
  value: 'sscSequence',
  default: {
    duration: 2000,
    delay: 500,
    intersection: 80,
    reiterate: true,
    easing: 'easeInOutQuad'
  }
}, {
  label: 'ScrollJacking',
  value: 'sscScrollJacking',
  default: {
    intersection: 10,
    duration: 800,
    delay: 500,
    reiterate: true,
    easing: 'easeOutExpo'
  }
}, {
  label: 'Counter',
  value: 'sscCounter',
  default: {
    duration: 8000,
    delay: 0,
    reiterate: true,
    easing: 'easeInOutExpo',
    target: 'number'
  }
}, {
  label: 'Text Stagger',
  value: 'sscTextStagger',
  default: {
    duration: 5000,
    delay: 1000,
    reiterate: true,
    easing: 'easeInOutQuad',
    preset: 'default',
    splitBy: 'letter',
    intersection: 80
  }
}, {
  label: 'Screen Jump',
  value: 'sscScreenJump',
  default: {
    target: 'none'
  }
}, {
  label: 'Navigator',
  value: 'sscNavigator',
  default: {}
}];
const animationList = [{
  label: 'No Animation',
  value: false
}, {
  label: 'bounce',
  value: 'bounce'
}, {
  label: 'flash',
  value: 'flash'
}, {
  label: 'pulse',
  value: 'pulse'
}, {
  label: 'rubberBand',
  value: 'rubberBand'
}, {
  label: 'shakeX',
  value: 'shakeX'
}, {
  label: 'shakeY',
  value: 'shakeY'
}, {
  label: 'headShake',
  value: 'headShake'
}, {
  label: 'swing',
  value: 'swing'
}, {
  label: 'tada',
  value: 'tada'
}, {
  label: 'wobble',
  value: 'wobble'
}, {
  label: 'jello',
  value: 'jello'
}, {
  label: 'heartBeat',
  value: 'heartBeat'
}, {
  label: 'hinge',
  value: 'hinge'
}, {
  label: 'jackInTheBox',
  value: 'jackInTheBox'
}, {
  label: 'rollIn',
  value: 'rollIn'
}, {
  label: 'rollOut',
  value: 'rollOut'
},
// Back
{
  label: 'backInDown',
  value: 'backInDown'
}, {
  label: 'backInLeft',
  value: 'backInLeft'
}, {
  label: 'backInRight',
  value: 'backInRight'
}, {
  label: 'backInUp',
  value: 'backInUp'
}, {
  label: 'backOutDown',
  value: 'backOutDown'
}, {
  label: 'backOutLeft',
  value: 'backOutLeft'
}, {
  label: 'backOutRight',
  value: 'backOutRight'
}, {
  label: 'backOutUp',
  value: 'backOutUp'
},
// Bouncing
{
  label: 'bounceIn',
  value: 'bounceIn'
}, {
  label: 'bounceInDown',
  value: 'bounceInDown'
}, {
  label: 'bounceInLeft',
  value: 'bounceInLeft'
}, {
  label: 'bounceInRight',
  value: 'bounceInRight'
}, {
  label: 'bounceInUp',
  value: 'bounceInUp'
}, {
  label: 'bounceOut',
  value: 'bounceOut'
}, {
  label: 'bounceOutDown',
  value: 'bounceOutDown'
}, {
  label: 'bounceOutLeft',
  value: 'bounceOutLeft'
}, {
  label: 'bounceOutRight',
  value: 'bounceOutRight'
}, {
  label: 'bounceOutUp',
  value: 'bounceOutUp'
},
// Fade
{
  label: 'fadeIn',
  value: 'fadeIn'
}, {
  label: 'fadeInDown',
  value: 'fadeInDown'
}, {
  label: 'fadeInDownBig',
  value: 'fadeInDownBig'
}, {
  label: 'fadeInLeft',
  value: 'fadeInLeft'
}, {
  label: 'fadeInLeftBig',
  value: 'fadeInLeftBig'
}, {
  label: 'fadeInRight',
  value: 'fadeInRight'
}, {
  label: 'fadeInRightBig',
  value: 'fadeInRightBig'
}, {
  label: 'fadeInUp',
  value: 'fadeInUp'
}, {
  label: 'fadeInUpBig',
  value: 'fadeInUpBig'
}, {
  label: 'fadeInTopLeft',
  value: 'fadeInTopLeft'
}, {
  label: 'fadeInTopRight',
  value: 'fadeInTopRight'
}, {
  label: 'fadeInTopRight',
  value: 'fadeInTopRight'
}, {
  label: 'fadeInBottomLeft',
  value: 'fadeInBottomLeft'
},
// fade exit
{
  label: 'fadeOut',
  value: 'fadeOut'
}, {
  label: 'fadeOutDown',
  value: 'fadeOutDown'
}, {
  label: 'fadeOutDownBig',
  value: 'fadeOutDownBig'
}, {
  label: 'fadeOutLeft',
  value: 'fadeOutLeft'
}, {
  label: 'fadeOutLeftBig',
  value: 'fadeOutLeftBig'
}, {
  label: 'fadeOutRight',
  value: 'fadeOutRight'
}, {
  label: 'fadeOutRightBig',
  value: 'fadeOutRightBig'
}, {
  label: 'fadeOutUp',
  value: 'fadeOutUp'
}, {
  label: 'fadeOutUpBig',
  value: 'fadeOutUpBig'
}, {
  label: 'fadeOutTopLeft',
  value: 'fadeOutTopLeft'
}, {
  label: 'fadeOutTopRight',
  value: 'fadeOutTopRight'
}, {
  label: 'fadeOutTopRight',
  value: 'fadeOutTopRight'
}, {
  label: 'fadeOutBottomLeft',
  value: 'fadeOutBottomLeft'
},
// Lightspeed
{
  label: 'lightSpeedInRight',
  value: 'lightSpeedInRight'
}, {
  label: 'lightSpeedInLeft',
  value: 'lightSpeedInLeft'
}, {
  label: 'lightSpeedOutRight',
  value: 'lightSpeedOutRight'
}, {
  label: 'lightSpeedOutLeft',
  value: 'lightSpeedOutLeft'
},
// Zooming
{
  label: 'zoomIn',
  value: 'zoomIn'
}, {
  label: 'zoomInDown',
  value: 'zoomInDown'
}, {
  label: 'zoomInLeft',
  value: 'zoomInLeft'
}, {
  label: 'zoomInRight',
  value: 'zoomInRight'
}, {
  label: 'zoomInUp',
  value: 'zoomInUp'
}, {
  label: 'zoomOut',
  value: 'zoomOut'
}, {
  label: 'zoomOutDown',
  value: 'zoomOutDown'
}, {
  label: 'zoomOutLeft',
  value: 'zoomOutLeft'
}, {
  label: 'zoomOutRight',
  value: 'zoomOutRight'
}, {
  label: 'zoomOutUp',
  value: 'zoomOutUp'
},
// Sliding
{
  label: 'slideInDown',
  value: 'slideInDown'
}, {
  label: 'slideInLeft',
  value: 'slideInLeft'
}, {
  label: 'slideInRight',
  value: 'slideInRight'
}, {
  label: 'slideInUp',
  value: 'slideInUp'
}, {
  label: 'slideOutDown',
  value: 'slideOutDown'
}, {
  label: 'slideOutLeft',
  value: 'slideOutLeft'
}, {
  label: 'slideOutRight',
  value: 'slideOutRight'
}, {
  label: 'slideOutUp',
  value: 'slideOutUp'
}];
const textStaggerPresets = {
  default: [{
    translateY: ['1em', 0],
    translateZ: 0
  }],
  expo: [{
    scale: [15, 1],
    opacity: [0, 1]
  }],
  domino: [{
    rotateY: [-90, 0],
    transformOrigin: '0 0'
  }],
  ghosting: [{
    translateX: [40, 0],
    translateZ: 0
  }, {
    translateX: [0, -30],
    opacity: [1, 0]
  }],
  elasticIn: [{
    scale: [0, 1],
    elasticity: 1200
  }],
  rain: [{
    translateY: ['-2em', 0],
    scaleX: [0, 1],
    opacity: [0, 1]
  }],
  snake: [{
    scaleX: [0, 1],
    translateY: ['1em', 0],
    translateX: ['.5em', 0],
    translateZ: 0,
    rotateZ: [90, 0],
    transformOrigin: '100% 50%'
  }]
};
const textStaggerPresetsNames = [];
Object.keys(textStaggerPresets).map(item => textStaggerPresetsNames.push({
  label: item,
  value: item
}));

/***/ }),

/***/ "./src/utils/fn.ts":
/*!*************************!*\
  !*** ./src/utils/fn.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoLintCode": () => (/* binding */ autoLintCode),
/* harmony export */   "capitalToloDash": () => (/* binding */ capitalToloDash),
/* harmony export */   "css2obj": () => (/* binding */ css2obj),
/* harmony export */   "dataStringify": () => (/* binding */ dataStringify),
/* harmony export */   "getDefaults": () => (/* binding */ getDefaults),
/* harmony export */   "getElelementData": () => (/* binding */ getElelementData),
/* harmony export */   "lintCSS": () => (/* binding */ lintCSS),
/* harmony export */   "loDashToCapital": () => (/* binding */ loDashToCapital),
/* harmony export */   "parseCSS": () => (/* binding */ parseCSS),
/* harmony export */   "splitSentence": () => (/* binding */ splitSentence),
/* harmony export */   "styleObj2String": () => (/* binding */ styleObj2String)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/utils/data.ts");


/**
 * It takes a data object and a type string, and returns a string of the data object's key/value pairs, separated by semicolons
 *
 * @param {Object} data - The data object to be converted to a string.
 * @param {string} type - The type of data we're working with.
 *
 * @return {string}     - A stringified version of the Object
 */
function dataStringify(data, type) {
  let csv = '';
  csv += Object.entries(data).map(item => {
    if (type === 'sequence') {
      return item[1].action + ':' + item[1].value;
    }
    return item[0] !== 'steps' && item[0] !== 'scene' ? item[0] + ':' + item[1] : null;
  }).join(';');
  return csv || null;
}

/**
 * It takes a jss style object and returns a string of linted CSS code
 *
 * @param {string} style - The style object to be linted.
 *
 * @return {string} A string of CSS code.
 */
function lintCSS(style) {
  return style && Object.keys(style).length ? 'this {\n' + capitalToloDash(autoLintCode(styleObj2String(style))) + ';\n}' : 'this {\n\t\n}';
}

/**
 * It takes a string of CSS and converts it to an object
 * if this string is in jss format will be converted to css
 *
 * @param {string} style - the style string to be parsed
 *
 * @return {Object} - the css string converted into an object
 */
const parseCSS = style => {
  // remove all breaklines
  let result = style.replaceAll('\n', '');
  // get all the content inside "this{ }"
  result = result.match('this {(.*?)}')[1];
  // convert jss to css
  result = css2obj(result);
  return result;
};

/**
 * It takes a string of CSS and returns an object of key/value pairs in jss format
 *
 * @param {string} css - The CSS string to convert to an object.
 * @return {Object} An object with the CSS properties as keys and the CSS values as values.
 */
const css2obj = css => {
  const r = /(?<=^|;)\s*([^:]+)\s*:\s*([^;]+)\s*/g,
    style = {};
  css.replace(r, (m, p, v) => style[loDashToCapital(p)] = v);
  return style;
};

/**
 * JSON style object to a CSS string
 *
 * It takes an object of CSS styles and returns a string of CSS styles
 *
 * @param {Object} style       - The style object to convert to a string.
 * @param {string} [indent=\t] - The string to use for indentation.
 */
const styleObj2String = function (style) {
  let indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\t';
  return Object.entries(style).map(_ref => {
    let [k, v] = _ref;
    return indent + `${k}: ${v}`;
  }).join(';');
};

/**
 * It takes a string and replaces all capital letters with a dash followed by the lowercase version of the letter
 *
 * @param {string} k - The string to be converted.
 */
const capitalToloDash = k => k.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);

/**
 * Replace all hyphens followed by a lowercase letter with the same letter capitalized.
 *
 * @param {string} k - The string to be converted.
 */
const loDashToCapital = k => k.replace(/-[a-z]/g, match => `${match[1].toUpperCase()}`);

/**
 * It takes a string of JavaScript code and adds a newline after every semicolon and opening curly brace
 *
 * @param {string} k - The code to be linted.
 * @return {string} the matched value with a new line character appended to it.
 */
const autoLintCode = k => k.replace(/\;| \{/gi, function (matched) {
  return matched + '\n';
});

/**
 * Parses the dataset stored with wp editor and returns an object with the arguments as keys and values
 *
 * @param {string} opts        - The string of data attributes that we want to parse.
 * @param {string} [type=data] - The type of data you want to get. Use style to parse css style
 * @return {Object}            - An object with the key being the first element of the array and the value being the second element of the array.
 */
const getElelementData = function (opts) {
  let type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data';
  if (opts) {
    const rawArgs = opts.split(';');
    let parsedArgs = [];
    parsedArgs = rawArgs.map(arg => arg.split(':'));
    const args = {};
    parsedArgs.forEach((el, index) => {
      if (el[0] !== 'defalut') {
        if (type === 'style') {
          args[index] = {
            property: el[0],
            value: el[1]
          };
        } else {
          args[el[0]] = el[1];
        }
      }
    });
    return args;
  }
  return false;
};

/**
 * Split a sentence into words or letters
 *
 * It takes a sentence and splits it into words, then splits each word into letters
 *
 * @param {string} sentence       - The sentence to be split.
 * @param {string} [splitBy=word] - 'word' or 'letter'
 *
 * @return {string} A string of HTML with the words and letters wrapped in span tags.
 */
function splitSentence(sentence) {
  let splitBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'word';
  const words = sentence.split(' ');
  const result = words.map(word => {
    if (splitBy === 'word') {
      return `<span class="word">${word}</span>`;
    }
    return '<span class="word">' + word.replace(/([^\x00-\x80]|\w)/g, `<span class="letter">$&</span>`) + '</span>';
  });
  return result.join(' ');
}

/**
 * It takes an animation type and returns the default values for that animation
 *
 * @param {string} opt - The animation type selected.
 *
 * @return {Object} The default values for the animation type.
 */
const getDefaults = opt => {
  const animationType = _data__WEBPACK_IMPORTED_MODULE_0__.animationTypes.filter(animation => {
    return animation.value ? animation.value === opt : null;
  });
  return animationType[0] ? animationType[0].default : {};
};

/***/ }),

/***/ "./node_modules/classnames/index.js":
/*!******************************************!*\
  !*** ./node_modules/classnames/index.js ***!
  \******************************************/
/***/ ((module, exports) => {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;
	var nativeCodeString = '[native code]';

	function classNames() {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				if (arg.length) {
					var inner = classNames.apply(null, arg);
					if (inner) {
						classes.push(inner);
					}
				}
			} else if (argType === 'object') {
				if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes('[native code]')) {
					classes.push(arg.toString());
					continue;
				}

				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if ( true && module.exports) {
		classNames.default = classNames;
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {}
}());


/***/ }),

/***/ "./src/styles/editor.scss":
/*!********************************!*\
  !*** ./src/styles/editor.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/compose":
/*!*********************************!*\
  !*** external ["wp","compose"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["compose"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./src/ssc-editor.ts ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _admin_panelExtras__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./admin/panelExtras */ "./src/admin/panelExtras.tsx");
/* harmony import */ var _blockAttributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./blockAttributes */ "./src/blockAttributes.ts");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./src/save.ts");
/* harmony import */ var _styles_editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./styles/editor.scss */ "./src/styles/editor.scss");
/**
 * WordPress Dependencies
 */





// css style

(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('blocks.registerBlockType', 'sscEditor/add-attributes', _blockAttributes__WEBPACK_IMPORTED_MODULE_2__.addAttributes);
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('blocks.getSaveContent.extraProps', 'sscEditor/addExtraProps', _save__WEBPACK_IMPORTED_MODULE_3__.addExtraProps);
(0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_0__.addFilter)('editor.BlockEdit', 'sscEditor/advancedAnimationsControls', _admin_panelExtras__WEBPACK_IMPORTED_MODULE_1__.AnimationAdvancedControls);
})();

/******/ })()
;
//# sourceMappingURL=ssc-editor.js.map