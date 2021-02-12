class SectionS {
    /**
     * init
     */
    constructor(options) {
        // provide options
        this.options = {
            selector: '.section',
            offset: null,
            has: null
        };
        // current section we are on
        this.currentSection = 0;
        // bottom of sections by number
        this.sections = [];
        // store events
        this.events = {};
        /**
         * Runs on window resize
         */
        this.resizeEvent = this.debounce(() => {
            this.sections.splice(0, this.sections.length);
            this.setupSections();
        });
        /**
         * Runs on page scrolling
         */
        this.scrollEvent = this.debounce(() => {
            // work out what section were on
            const sectionsY = this.sections.map(o => o.y);
            const sectionId = Math.max(...sectionsY
                .filter(e => window.scrollY >= e));
            const sectionIndex = sectionsY.indexOf(sectionId) + 1;
            // set current section and emit event if changed
            if (this.currentSection !== sectionIndex) {
                this.currentSection = sectionIndex;
                this.callChangedEvent();
            }
        }, 10);
        this.options = Object.assign(this.options, options);
        this.setupSections();
        window.addEventListener('scroll', this.scrollEvent.bind(this), true);
        window.addEventListener('resize', this.resizeEvent.bind(this), true);
    }
    /**
     * store changed event user is subscribed to
     */
    changed(cb) {
        this.events.changed = cb;
        this.callChangedEvent(); // emit when registered
    }
    /**
     * Destroy
     */
    destroy() {
        window.removeEventListener('scroll', this.scrollEvent.bind(this), true);
        window.removeEventListener('resize', this.resizeEvent.bind(this), true);
    }
    /**
     * Caculate the sections based on the document and store
     */
    setupSections() {
        this.sections = Array.from(window.document.querySelectorAll(this.options.selector)).map((el) => {
            const y = Math.round(el.getBoundingClientRect().top + el.clientHeight) + window.scrollY + (this.options.offset ? this.options.offset : 0);
            return { y, classList: [].slice.apply(el.classList) };
        });
    }
    /**
     * check and call changed event
     */
    callChangedEvent() {
        if (!this.events.changed) {
            return;
        }
        // call changed event
        this.events.changed(this.currentSection, this.options.has ? this.sections[this.currentSection].classList.includes(this.options.has) : undefined);
    }
    /**
     * Bounce functions. Prevent methods from being called to many times
     */
    debounce(cb, wait = 70) {
        let h = 0;
        let callable = (...args) => {
            clearTimeout(h);
            h = window.setTimeout(() => cb(...args), wait);
        };
        return callable;
    }
}
export default SectionS;
