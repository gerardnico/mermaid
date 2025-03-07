/* eslint-env jest */
import { imgSnapshotTest, renderGraph } from '../../helpers/util';

describe('Entity Relationship Diagram', () => {
  it('should render a simple ER diagram', () => {
    imgSnapshotTest(
      `
    erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render an ER diagram with a recursive relationship', () => {
    imgSnapshotTest(
      `
    erDiagram
        CUSTOMER ||..o{ CUSTOMER : refers
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render an ER diagram with multiple relationships between the same two entities', () => {
    imgSnapshotTest(
      `
    erDiagram
        CUSTOMER ||--|{ ADDRESS : "invoiced at"
        CUSTOMER ||--|{ ADDRESS : "receives goods at"
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render a cyclical ER diagram', () => {
    imgSnapshotTest(
      `
    erDiagram
        A ||--|{ B : likes
        B ||--|{ C : likes
        C ||--|{ A : likes
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render a not-so-simple ER diagram', () => {
    imgSnapshotTest(
      `
    erDiagram
        CUSTOMER }|..|{ DELIVERY-ADDRESS : has
        CUSTOMER ||--o{ ORDER : places
        CUSTOMER ||--o{ INVOICE : "liable for"
        DELIVERY-ADDRESS ||--o{ ORDER : receives
        INVOICE ||--|{ ORDER : covers
        ORDER ||--|{ ORDER-ITEM : includes
        PRODUCT-CATEGORY ||--|{ PRODUCT : contains
        PRODUCT ||--o{ ORDER-ITEM : "ordered in"
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render multiple ER diagrams', () => {
    imgSnapshotTest(
      [
      `
    erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `,
      `
    erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `
      ],
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render an ER diagram with blank or empty labels', () => {
    imgSnapshotTest(
      `
    erDiagram
        BOOK }|..|{ AUTHOR : ""
        BOOK }|..|{ GENRE : " "
        AUTHOR }|..|{ GENRE : "  "
      `,
      {logLevel : 1}
    );
    cy.get('svg');
  });

  it('should render an ER diagrams when useMaxWidth is true (default)', () => {
    renderGraph(
      `
    erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `,
      { er: { useMaxWidth: true } }
    );
    cy.get('svg')
      .should((svg) => {
        expect(svg).to.have.attr('width', '100%');
        expect(svg).to.have.attr('height', '100%');
        const style = svg.attr('style');
        expect(style).to.match(/^max-width: [\d.]+px;$/);
        const maxWidthValue = parseFloat(style.match(/[\d.]+/g).join(''));
        // use within because the absolute value can be slightly different depending on the environment ±5%
        expect(maxWidthValue).to.be.within(140 * .95, 140 * 1.05);
      });
  });

  it('should render an ER when useMaxWidth is false', () => {
    renderGraph(
      `
    erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
      `,
      { er: { useMaxWidth: false } }
    );
    cy.get('svg')
      .should((svg) => {
        const width = parseFloat(svg.attr('width'));
        // use within because the absolute value can be slightly different depending on the environment ±5%
        expect(width).to.be.within(140 * .95, 140 * 1.05);
        expect(svg).to.have.attr('height', '465');
        expect(svg).to.not.have.attr('style');
      });
  });

  it('should render entities that have no relationships', () => {
    renderGraph(
      `
    erDiagram
        DEAD_PARROT
        HERMIT
        RECLUSE
        SOCIALITE }o--o{ SOCIALITE : "interacts with"
        RECLUSE }o--o{ SOCIALITE : avoids
      `,
      { er: { useMaxWidth: false } }
    );
    cy.get('svg');
  });

  it('should render entities with and without attributes', () => {
    renderGraph(
      `
    erDiagram
        BOOK { string title }
        AUTHOR }|..|{ BOOK : writes
        BOOK { float price }
      `,
      { logLevel : 1 }
    );
    cy.get('svg');
  });

  it('should render entities and attributes with big and small entity names', () => {
    renderGraph(
      `
    erDiagram
        PRIVATE_FINANCIAL_INSTITUTION {
          string name
          int    turnover
        }
        PRIVATE_FINANCIAL_INSTITUTION ||..|{ EMPLOYEE : employs
        EMPLOYEE { bool officer_of_firm }
      `,
      { logLevel : 1 }
    );
    cy.get('svg');
  });

  it('should render entities with keys and comments', () => {
    renderGraph(
      `
    erDiagram
        BOOK { string title PK "comment"}
      `,
      { logLevel : 1 }
    );
    cy.get('svg');
  });

});
