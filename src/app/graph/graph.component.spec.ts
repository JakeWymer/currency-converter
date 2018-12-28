import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { GraphComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate inital graph nodes', () => {
    let nodes = component.populateGraphNodes();
    let containsNodeObjects = nodes.every(node => {
      return node.data.hasOwnProperty('value') && node.hasOwnProperty('position');
    });

    expect(Array.isArray(nodes) && nodes.length === 30).toBeTruthy();
    expect(containsNodeObjects).toBeTruthy();
  });

  it('should populate inital graph edges', () => {
    let nodes = Array(30).fill({});
    let edges = component.populateGraphEdges(nodes);
    let containsEdgeObjects = edges.every(edge => {
      return edge.data.hasOwnProperty('source') && edge.data.hasOwnProperty('target');
    });

    expect(Array.isArray(edges)).toBeTruthy();
    expect(containsEdgeObjects).toBeTruthy();
    expect(edges.length).toEqual(29);
  });
});
