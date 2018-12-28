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
    return Array(30).fill({}).map((val, i) => {
      return ({
        data: {id: i, value: 1},
        position: { 
          x: (window.innerWidth / 22) * i,
          y: 100
        },
        selectable: false,
      });
    });
  }

  populateGraphEdges(graphNodes) {
    return graphNodes.map((node, i) => {
      if(i !== graphNodes.length - 1) {
        return {
          data: {
            id: `${i}${i + 1}e`,
            source: `${i}`,
            target: `${i + 1}`
          }
        }
      }
    }).slice(0, graphNodes.length - 1);
  }

}
