var _templateObject = _taggedTemplateLiteralLoose(
  ["\n  width: 100%;\n  position: relative;\n"],
  ["\n  width: 100%;\n  position: relative;\n"]
)

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function")
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    )
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    )
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass)
}

function _taggedTemplateLiteralLoose(strings, raw) {
  strings.raw = raw
  return strings
}

/* global document */
import PropTypes from "prop-types"
import React from "react"
import styled from "styled-components"

import List from "./components/List"

var Wrapper = styled.div(_templateObject)

var GooglePlacesSuggest = (function(_React$Component) {
  _inherits(GooglePlacesSuggest, _React$Component)

  function GooglePlacesSuggest(props) {
    _classCallCheck(this, GooglePlacesSuggest)

    var _this = _possibleConstructorReturn(this, _React$Component.call(this))

    _this.hasFocus = false

    _this.state = {
      focusedPredictionIndex: 0,
      predictions: [],
      open: !!props.autocompletionRequest && props.autocompletionRequest.input,
    }

    _this.handleKeyDown = _this.handleKeyDown.bind(_this)
    _this.onFocusChange = _this.onFocusChange.bind(_this)
    _this.handleDOMClick = _this.handleDOMClick.bind(_this)
    return _this
  }

  GooglePlacesSuggest.prototype.componentWillMount = function componentWillMount() {
    this.updatePredictions(this.props.autocompletionRequest)
    document.addEventListener("click", this.handleDOMClick)
  }

  GooglePlacesSuggest.prototype.componentWillUnmount = function componentWillUnmount() {
    document.removeEventListener("click", this.handleDOMClick)
  }

  GooglePlacesSuggest.prototype.componentWillReceiveProps = function componentWillReceiveProps(
    nextProps
  ) {
    if (
      this.props.autocompletionRequest !== nextProps.autocompletionRequest &&
      nextProps.autocompletionRequest
    ) {
      this.updatePredictions(nextProps.autocompletionRequest)
    }
  }

  GooglePlacesSuggest.prototype.handleSelectPrediction = function handleSelectPrediction(
    suggest
  ) {
    var _this2 = this

    var _props = this.props,
      onSelectSuggest = _props.onSelectSuggest,
      onGeocodeSuggest = _props.onGeocodeSuggest

    this.setState(
      {
        open: false,
        predictions: [],
      },
      function() {
        _this2.hasFocus = false
        onSelectSuggest(suggest)
        if (!onGeocodeSuggest) return
        _this2.geocodePrediction(suggest.description, function(result) {
          onGeocodeSuggest(result, suggest)
        })
      }
    )
  }

  GooglePlacesSuggest.prototype.updatePredictions = function updatePredictions(
    autocompletionRequest
  ) {
    var _this3 = this

    var googleMaps = this.props.googleMaps

    var autocompleteService = new googleMaps.places.AutocompleteService()
    if (!autocompletionRequest || !autocompletionRequest.input) {
      this.setState(
        {
          open: false,
          predictions: [],
        },
        function() {
          return (_this3.hasFocus = false)
        }
      )
      return
    }

    autocompleteService.getPlacePredictions(
      autocompletionRequest, // https://developers.google.com/maps/documentation/javascript/reference?hl=fr#AutocompletionRequest
      function(predictions, status) {
        _this3.props.onStatusUpdate(status)
        if (!predictions) {
          _this3.setState({open: true, predictions: []})
          return
        }
        _this3.setState({
          focusedPredictionIndex: 0,
          open: true,
          predictions: predictions,
        })
      }
    )
  }

  GooglePlacesSuggest.prototype.geocodePrediction = function geocodePrediction(
    address,
    callback
  ) {
    var googleMaps = this.props.googleMaps

    var geocoder = new googleMaps.Geocoder()

    geocoder.geocode({address: address}, function(results, status) {
      if (status === googleMaps.GeocoderStatus.OK) {
        if (results.length > 0) {
          callback(results[0])
        }
      } else {
        // eslint-disable-next-line
        console.error("Geocode error: " + status)
      }
    })
  }

  GooglePlacesSuggest.prototype.handleKeyDown = function handleKeyDown(e) {
    var _state = this.state,
      focusedPredictionIndex = _state.focusedPredictionIndex,
      predictions = _state.predictions

    if (predictions.length > 0) {
      if (e.key === "Enter") {
        this.handleSelectPrediction(predictions[focusedPredictionIndex])
      } else if (e.key === "ArrowUp") {
        if (predictions.length > 0 && focusedPredictionIndex > 0) {
          this.focusPrediction(focusedPredictionIndex - 1)
        }
      } else if (e.key === "ArrowDown") {
        if (
          predictions.length > 0 &&
          focusedPredictionIndex < predictions.length - 1
        ) {
          this.focusPrediction(focusedPredictionIndex + 1)
        }
      }
    } else if (e.key === "Enter") {
      var onNoResult = this.props.onNoResult

      onNoResult()
    }
  }

  GooglePlacesSuggest.prototype.focusPrediction = function focusPrediction(
    index
  ) {
    this.setState({focusedPredictionIndex: index})
  }

  GooglePlacesSuggest.prototype.onFocusChange = function onFocusChange(val) {
    this.hasFocus = val
  }

  GooglePlacesSuggest.prototype.handleDOMClick = function handleDOMClick() {
    var _this4 = this

    if (!this.hasFocus && this.state.open) {
      this.setState({open: false}, function() {
        if (_this4.props.onBlur) _this4.props.onBlur()
      })
    }
  }

  GooglePlacesSuggest.prototype.render = function render() {
    var _this5 = this

    var _state2 = this.state,
      focusedPredictionIndex = _state2.focusedPredictionIndex,
      open = _state2.open,
      predictions = _state2.predictions
    var _props2 = this.props,
      children = _props2.children,
      customContainerRender = _props2.customContainerRender,
      customRender = _props2.customRender,
      displayPoweredByGoogle = _props2.displayPoweredByGoogle,
      textNoResults = _props2.textNoResults

    return React.createElement(
      Wrapper,
      {onKeyDown: this.handleKeyDown},
      children,
      open &&
        React.createElement(List, {
          items: predictions,
          activeItemIndex: focusedPredictionIndex,
          customContainerRender: customContainerRender,
          customRender: customRender,
          displayPoweredByGoogle: displayPoweredByGoogle,
          onSelect: function onSelect(suggest) {
            return _this5.handleSelectPrediction(suggest)
          },
          textNoResults: textNoResults,
          onFocusChange: this.onFocusChange,
        })
    )
  }

  return GooglePlacesSuggest
})(React.Component)

GooglePlacesSuggest.propTypes =
  process.env.NODE_ENV !== "production"
    ? {
        children: PropTypes.any.isRequired,
        googleMaps: PropTypes.object.isRequired,
        onNoResult: PropTypes.func,
        onSelectSuggest: PropTypes.func,
        onGeocodeSuggest: PropTypes.func,
        onBlur: PropTypes.func,
        onStatusUpdate: PropTypes.func,
        customContainerRender: PropTypes.func,
        customRender: PropTypes.func,
        displayPoweredByGoogle: PropTypes.bool,
        autocompletionRequest: PropTypes.shape({
          input: PropTypes.string.isRequired,
        }).isRequired,
        textNoResults: PropTypes.string,
      }
    : {}

GooglePlacesSuggest.defaultProps = {
  displayPoweredByGoogle: true,
  onNoResult: function onNoResult() {},
  onSelectSuggest: function onSelectSuggest() {},
  onStatusUpdate: function onStatusUpdate() {},
  textNoResults: "No results",
}

export default GooglePlacesSuggest
