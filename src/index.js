import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

class RNGooglePlaces extends Component {
  constructor(props) {
    super(props);
    let region = typeof this.props.region != "undefined" ? this.props.region : this.props.initialRegion; 

    this.state = { 
      center: { 
        lat: typeof region != "undefined" ? region.latitude : 0, 
        lng: typeof region != "undefined" ? region.longitude : 0 
      }
    };
  }


  render() {
    const { style } = this.props;
    if (!this.state.center)
      return (
        <View style={style}>
          <ActivityIndicator />
        </View>
      );
    return (
      <View style={style}>
        <div>Poner aqui el mapa, barra superior superpuesta en el mapa y bloque inferior con sugerencias cercanas</div>
      </View>
    );
  }
}




export default RNGooglePlaces;