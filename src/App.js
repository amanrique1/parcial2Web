import React, { Component } from 'react';
import PeliculaDetail from './components/PeliculaDetail';
import {
	FormattedDate,
	FormattedNumber,
	FormattedPlural,
	FormattedMessage
} from 'react-intl';
import * as d3 from 'd3';

const width = 700;
const height = 500;
const margin = { top: 10, left: 50, bottom: 40, right: 10 };
const iwidth = width - margin.left - margin.right;
const iheight = height - margin.top - margin.bottom;

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			peliculas: [],
			seleccionada: {},
			idioma: this.props.idioma
		};

		this.setSelected = this.setSelected.bind(this);
		this.getSelected = this.getSelected.bind(this);
		this.drawChart = this.drawChart.bind(this);
	}

	drawChart() {
		const canvas = d3.select(this.refs.canvas);
		const data = this.state.peliculas;

		const svg = canvas.append('svg');

		svg.attr('width', width);
		svg.attr('height', height);

		let g = svg
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const bars = g.selectAll('rect').data(data);

		const x = d3
			.scaleBand()
			.domain(data.map((d) => d.name))
			.range([0, iwidth])
			.padding(0.1);

		const y = d3
			.scaleLinear()
			.domain([0, 9256000])
			.range([iheight, 0]);

		bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.style('fill', 'steelblue')
			.attr('x', (d) => x(d.name))
			.attr('y', (d) => y(d.views))
			.attr('height', (d) => iheight - y(d.views))
			.attr('width', x.bandwidth());

		g.append('g')
			.classed('x--axis', true)
			.call(d3.axisBottom(x))
			.attr('transform', `translate(0, ${iheight})`);

		g.append('g')
			.classed('y--axis', true)
			.call(d3.axisLeft(y));
	}

	componentDidMount() {
		if (!navigator.onLine) {
			if (localStorage.getItem('peliculas') === null)
				this.setState({ peliculas: [] });
			else {
				console.log(localStorage.getItem('peliculas'));
				this.setState({
					peliculas: JSON.parse(localStorage.getItem('peliculas'))
				});
			}
			if (localStorage.getItem('pelicula') === null)
				this.setState({ seleccionada: {} });
			else {
				console.log(localStorage.getItem('pelicula'));
				this.setState({
					seleccionada: JSON.parse(localStorage.getItem('pelicula'))
				});
			}
		}
		let urlEn =
			'https://gist.githubusercontent.com/josejbocanegra/8b436480129d2cb8d81196050d485c56/raw/48cc65480675bf8b144d89ecb8bcd663b05e1db0/data-en.json';
		let urlEs =
			'https://gist.githubusercontent.com/josejbocanegra/f784b189117d214578ac2358eb0a01d7/raw/2b22960c3f203bdf4fac44cc7e3849689218b8c0/data-es.json';
		let url = this.state.idioma === 'en' ? urlEn : urlEs;
		fetch(url)
			.then((res) => res.json())
			.then((json) => {
				this.setState(
					{
						peliculas: json,
						seleccionada: json[0]
					},
					() => {
						this.drawChart();
					}
				);
				localStorage.setItem('peliculas', JSON.stringify(json));
				localStorage.setItem('pelicula', JSON.stringify(json[0]));
			});
	}
	setSelected(id) {
		this.setState({
			seleccionada: this.state.peliculas[id - 1]
		});
		localStorage.setItem(
			'pelicula',
			JSON.stringify(this.state.peliculas[id - 1])
		);
	}
	getSelected() {
		console.log(this.state.seleccionada);
		return this.state.seleccionada;
	}

	render() {
		return (
			<div className='container'>
				<div className='row mt-4'>
					<div className='col-md-8 text-center'>
						<table className='table'>
							<thead>
								<tr>
									<th scope='col'>#</th>
									<th scope='col'>
										<FormattedMessage id='name' />
									</th>
									<th scope='col'>
										<FormattedMessage id='directed' />
									</th>
									<th scope='col'>
										<FormattedMessage id='country' />
									</th>
									<th scope='col'>
										<FormattedMessage id='budget' />
									</th>
									<th scope='col'>
										<FormattedMessage id='release' />
									</th>
									<th scope='col'>
										<FormattedMessage id='views' />
									</th>
								</tr>
							</thead>
							<tbody>
								{this.state.peliculas.map((e, i) => (
									<tr key={i} onClick={() => this.setSelected(e.id)}>
										<th scope='row'>{e.id} </th>
										<td>{e.name}</td>
										<td>{e.directedBy}</td>
										<td>{e.country}</td>
										<td>
											{e.budget}
											<FormattedPlural
												value={e.budget}
												one={<FormattedMessage id='singular' />}
												other={<FormattedMessage id='plural' />}
											/>
										</td>
										<td>
											<FormattedDate
												value={new Date(e.releaseDate)}
												year='numeric'
												month='long'
												day='numeric'
												weekday='long'
											/>
										</td>
										<td>
											<FormattedNumber value={e.views} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className='row'>
							<div ref='canvas'></div>
						</div>
					</div>

					<div className='col-md-4'>
						<PeliculaDetail pelicula={this.state.seleccionada} />
					</div>
				</div>
			</div>
		);
	}
}
