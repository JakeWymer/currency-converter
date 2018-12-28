import { Component, OnInit } from '@angular/core';
import cytoscape from 'cytoscape';
import { ExchangeService } from '../exchange.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})

export class GraphComponent implements OnInit {

  constructor(private exchangeService: ExchangeService) { }
  
  ngOnInit() {
    let cy = cytoscape({
      container: document.getElementById('cy'),
      style: [{
        selector: 'node',
        style: {
          'label': 'data(value)'
        }
      }],
    });

    let nodes = this.populateGraphNodes();
    let edges = this.populateGraphEdges(nodes);

    cy.autoungrabify(true);
    cy.add(nodes);
    cy.add(edges);
    cy.fit();

    this.exchangeService.historicalRates.subscribe(rates => {
      cy.nodes().forEach((node, i) => {
        node.data('value', rates[i].value.toFixed(4));
        node.animate({
          position: {x: node.position('x'), y: rates[i].position.y},
        }, {
          duration: 500
        });
      });
    });
  }

  populateGraphNodes() {
    const NUMBER_OF_NODES = 30;

    return Array(NUMBER_OF_NODES).fill({}).map((val, i) => {
      return ({
        data: {id: i, value: 1},
        position: { 
          x: (window.innerWidth / NUMBER_OF_NODES) * i,
          y: 150
        },
        selectable: false,
      });
    });
  }

  populateGraphEdges(graphNodes) {
    let edges = [];

    for(let i = 0; i < graphNodes.length - 1; i++) {
      edges.push({
        data: {
          id: `${i}-${i + 1}`,
          source: `${i}`,
          target: `${i + 1}`
        }
      });
    }

    return edges;
  }
}
