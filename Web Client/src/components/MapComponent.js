import React, { Component } from "react";
import { Map, Marker, InfoWindow, GoogleApiWrapper } from "google-maps-react";
import Viewer from "react-viewer";
import "../style/map.css";

const mapStyles = { width: "100%", height: "100%", float: "left" };

class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedImage: null, visible: false };
    this.initial = props.imgs.length;
    this.getPredictions();
  }

  getPredictions() {
    this.props.imgs.forEach(function (img) {
      let string =
        "http://206798625f76.ngrok.io/download/" +
        img.name.split(".")[0] +
        ".png";

      fetch(string, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.blob();
        })
        .then((data) => {
          console.log(data);
          img.pred = data;
        });
    });
  }

  renderMarkers(imgs) {
    console.log(imgs);
    const views = [];
    for (let index = 0; index < imgs.length; index++) {
      views.push(
        <Marker
          key={index}
          name={imgs[index].name}
          position={{ lat: imgs[index].lat, lng: imgs[index].long }}
          draggable={false}
          onClick={() => {
            this.setState({ selectedImage: imgs[index] });
          }}
          icon={{
            url: imgs[index].url,
            scaledSize: new this.props.google.maps.Size(50, 50),
          }}
        />
      );
    }

    return views;
  }

  // viewImage = (e) => {
  //   // To prevent page refresh
  //   e.preventDefault();

  //   console.log("Display Image");
  // };

  render() {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <Map
          google={this.props.google}
          zoom={this.initial === 0 ? 3 : 18}
          style={mapStyles}
          className={"map"}
          initialCenter={
            this.initial === 0
              ? { lat: 0, lng: 0 }
              : { lat: this.props.imgs[0].lat, lng: this.props.imgs[0].long }
          }
          panControl={true}
        >
          {this.initial === 0 ? null : this.renderMarkers(this.props.imgs)}
          {this.state.selectedImage && (
            <InfoWindow
              position={{
                lat: this.state.selectedImage.lat,
                lng: this.state.selectedImage.long,
              }}
              style={{ top: "-50px" }}
              visible
            >
              <div
                onClick={() => {
                  console.log("Hello");
                }}
              >
                <img
                  className="prediction"
                  src={URL.createObjectURL(this.state.selectedImage.pred)}
                  width="200px"
                  alt="prediction"
                />
              </div>
            </InfoWindow>
          )}
        </Map>
        <Viewer
          visible={this.state.visible}
          onClose={() => {
            this.setState({ visible: false });
          }}
          images={[{ src: "", alt: "image" }]}
        />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyARATzKOf2nxzpW1uZ708KiRpodi9ZkzgE",
})(MapComponent);
