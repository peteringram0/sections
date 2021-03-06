# Sections

A tiny 4kb class (with no dependencies) to detect the page section the user is on as well as spy on fixed page elements to run events against based on the page sections (when the element starts to change between a section, the middle and the end of the section).

The library can be used to trigger events on the sections based on the users scroll position as well as trigger events on fixed elements related to the main sections.

[Demo](https://peteringram0.github.io/sections/)

## Usage: 
````typescript
new Sections({selector: '.sections'})
  .sectionStarted((section, direction) => {
    /**
     triggered when the section changes.
     */
  })
  .elementEvent(element, (eventType, direction, currentSection) => {
    /**
     add element event. Pass in the element and the method gets triggered when the element starts, the middle and the end meets the section's based on the section selector in the constructor. The direction and current section the user is on are provided into the method. This method is chainable.
     */
  })
````

### Options
You are able to pass options when setting up Sections. These have default values and are optional.
````typescript
export interface Options {
  selector: string
  scrollEventBounce: number
  resizeEventBounce: number
}
````

### sectionStarted
A section and a direction are provided:
````typescript
interface SectionInterface {
  index: number
  from: number
  to: number
  classList: string[]
}

enum Direction {
  UP = 'up',
  DOWN = 'down'
}
````

### elementEvent
Pass in your fixed element and the method will return the following based on the related position to the sections:
````typescript
enum EventType {
  START = 'start',
  MIDDLE = 'middle',
  END = 'end'
}

enum Direction {
  UP = 'up',
  DOWN = 'down'
}

interface SectionInterface {
  index: number
  from: number
  to: number
  classList: string[]
}
````

### Yarn / NPM:
````bash
yarn add @peter.ingram/sections
````