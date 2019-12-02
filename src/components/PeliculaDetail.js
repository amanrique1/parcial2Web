import React, { Component } from 'react'

export default class PeliculaDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pelicula: this.props.pelicula
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pelicula !== this.props.pelicula) {
            this.setState({
                pelicula: this.props.pelicula
            })
        }
    }
    render() {
        return (
            <div className="card" >
                {navigator.onLine ? <img src={this.state.pelicula.poster} className="card-img-top" /> : null}
                <div className="card-body">
                    <h5 className="card-title">{this.state.pelicula.name}</h5>
                    <p className="card-text">{this.state.pelicula.description}</p>
                </div>
            </div>
        )
    }
}
