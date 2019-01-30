import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
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
      address: '',
      place : null
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

  setSuggestion(suggestion){
    this.handleSelect(suggestion.description);
    this.setState({ address : suggestion.description });
    this.setState({
      place : {
        id : suggestion.placeId,
        name : suggestion.formattedSuggestion.mainText,
        address : suggestion.formattedSuggestion.secondaryText
      }
    });

    this.refs.autocomplete.handleInputOnBlur();
  }

  selectPlace(){
    this.props.onSelectPlace({
      ...this.state.place,
      location : {
          lat : this.state.center.lat,
          lng : this.state.center.lng
      }
    });
  }

  render() {
    if (!this.state.center)
      return (
        <View>
          <ActivityIndicator />
        </View>
      );

      // https://github.com/hibiken/react-places-autocomplete
    return (
      <View style={{flex : 1, fontSize : "smaller",fontFamily : 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif'}}>
        <GoogleMapContainer
          handleMapMounted={this.handleMapMounted}
          containerElement={<div style={{ flex : 1 }} />}
          mapElement={<div style={{ height: '100%', width : "100%" }} />}
          center={this.state.center}
          onDragStart={!!this.props.onRegionChange && this.props.onRegionChange}
          onDragEnd={this.onDragEnd}
          defaultZoom={16}
          onClick={this.props.onPress}
          defaultOptions={{
            streetViewControl: false,
            scaleControl: false,
            mapTypeControl: false,
            panControl: false,
            //zoomControl: false,
            rotateControl: false,
            fullscreenControl: false
          }}
        >
          {this.state.place != null &&
            <Marker
              draggable={false}
              position={this.state.center}
            />
          }
        </GoogleMapContainer>
        <View style={{width : "100%", position : "absolute", top : 48, left : 0, height: 45,paddingLeft: 15,paddingRight : 15}}>
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
            ref="autocomplete"
            searchOptions={{
              types: ['establishment']
            }}
          >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: this.props.searchText,
                  className: 'location-search-input',
                })}
                style={{width : "calc(100% - 15px)", height : 43, border: "none",borderRadius : 4, paddingLeft : 15}}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map(suggestion => {
                  const className = suggestion.active
                    ? 'suggestion-item--active'
                    : 'suggestion-item';
                  // inline style for demonstration purpose
                  const style = suggestion.active
                    ? { backgroundColor: 'white', cursor: 'pointer', width : "calc(100% - 15px)", paddingLeft : 15 }
                    : { backgroundColor: 'white', cursor: 'pointer', width : "calc(100% - 15px)", paddingLeft : 15 };
                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className,
                        style,
                      })}
                      onClick={() => this.setSuggestion(suggestion)}
                    >
                      <div style={{width : "100%", height : 28, paddingTop : 7.5, marginBottom : 2, fontWeight : "bold"}}>{suggestion.formattedSuggestion.mainText}</div>
                      <div style={{width : "100%", height : 28, marginTop : 2, marginBottom : 2}}>{suggestion.formattedSuggestion.secondaryText}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          </PlacesAutocomplete>
        </View>
        {this.state.place != null &&
          <TouchableOpacity 
            style={{width : "100%", height : 64, position : "relative", backgroundColor : "#D7D7D7", display: "flex", alignItems: "center", flexDirection : "row", paddingRight: 7.5, paddingLeft: 7.5}} 
            onPress={this.selectPlace.bind(this)}
          >
            <img src={require("./img/pin.png")} style={{width: 20, height: 20}}/>
            {this.state.place != null && 
              <div style={{marginLeft : 7.5}}>
                <span style={{display: "block",color: "white",fontWeight: "bold"}}>{this.state.place.name}</span>
                <span style={{paddingTop: 3.5, display: "block",color: "white"}}>{this.state.place.address}</span>
              </div>
            }
            <img src={require("./img/next.png")} style={{width: 20, height: 20, position : "absolute", right : 7.5}}/>
          </TouchableOpacity> 
        }
      </View>
    );
  }
}




export default RNGooglePlaces;