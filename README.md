# SectionS

A tiny 3kb class to detect the page section the user is on.

## Usage: 
````typescript
new SectionS(options)
  .changed((index, hasClass) => {
    console.log('entered section', index, has)
  })
````

## Options:
You can provide the following optional options

````typescript
interface Options {
  selector: string // class to detect default: '.section'
  offset: number | null // minus or add an offset default: null
  has: string | null // check for certain class. Returned in the 'hasClass' on the changed event
}
````

### Yarn / NPM:
````bash
yarn add @peter.ingram/section-s
````