import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { withGoogleMap, GoogleMap } from 'react-google-maps';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const GoogleMapContainer = withGoogleMap(props => <GoogleMap {...props} ref={props.handleMapMounted} />);

class RNGooglePlaces extends Component {
  constructor(props) {
    super(props);
    let region = typeof this.props.region != "undefined" ? this.props.region : this.props.initialRegion; 

    this.state = { 
      center: { 
        lat: typeof region != "undefined" ? region.latitude : 0, 
        lng: typeof region != "undefined" ? region.longitude : 0 
      },
      address: ''
    };
  }

  handleMapMounted = map => (this.map = map);

  handleChange = address => {
    this.setState({ address });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => this.setState({
        center: { 
          lat: latLng.lat, 
          lng: latLng.lng 
        }
      }))
      .catch(error => console.error('Error', error));
  };

  render() {
    if (!this.state.center)
      return (
        <View style={{backgroundColor : "blue"}}>
          <ActivityIndicator />
        </View>
      );

      // https://github.com/hibiken/react-places-autocomplete
    return (
      <View style={{flex : 1}}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ flex : 1 }} />}
          mapElement={<div style={{ height: '100%', width : "100%" }} />}
          center={this.state.center}
          onDragStart={!!this.props.onRegionChange && this.props.onRegionChange}
          onDragEnd={this.onDragEnd}
          defaultZoom={20}
          onClick={this.props.onPress}
        >
          {this.props.children}
        </GoogleMapContainer>
        <View style={{width : "100%", position : "absolute", top : 15, left : 0, height: 45,paddingLeft: 15,paddingRight : 15}}>
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
                style={{width : "100%", height : 43, border: "none",borderRadius :  4}}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: 'white', cursor: 'pointer', width : "100%" }
                    : { backgroundColor: 'white', cursor: 'pointer', width : "100%" };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                    >
                      <div style={{width : "100%", height : 28, marginTop : 2, marginBottom : 2, fontWeight : "bold"}}>{suggestion.formattedSuggestion.mainText}</div>
                      <div style={{width : "100%", height : 28, marginTop : 2, marginBottom : 2}}>{suggestion.formattedSuggestion.secondaryText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </PlacesAutocomplete>
        </View>
        <View style={{width : "100%", height : 64, backgroundColor : "green"}}>
            <span>TODO poner un marker en center,Aqui poner de inicio la localizacion actual, o una ver seleccionado el lugarl el nombre del lugar, y al lado un boton aceptar</span>
        </View>
      </View>
    );
  }
}




export default RNGooglePlaces;