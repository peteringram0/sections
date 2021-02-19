export var EventType;
(function (EventType) {
    EventType["START"] = "start";
    EventType["MIDDLE"] = "middle";
    EventType["END"] = "end";
})(EventType || (EventType = {}));
export var Direction;
(function (Direction) {
    Direction["UP"] = "up";
    Direction["DOWN"] = "down";
})(Direction || (Direction = {}));
class Sections {
    /**
     * init
     */
    constructor(options) {
        // provide options
        this.options = {
            selector: '.section',
            scrollEventBounce: 10,
            resizeEventBounce: 70
        };
        // current section we are on
        this.activeSection = null;
        // current direction
        this._scrollDirection = {
            direction: Direction.DOWN,
            lastScrollTop: 0
        };
        // bottom of sections by number
        this.sections = [];
        // array of elements which we wll be watching
        this.elementsEvent = [];
        // store events
        this.events = {};
        // Runs on window resize
        this.resizeEvent = this.debounce(() => {
            this.sections.splice(0, this.sections.length);
            this.setupSections();
            // re-setup bounding
            this.elementsEvent.map(i => {
                const bounding = i.el.getBoundingClientRect();
                i.from = bounding.top;
                i.to = bounding.top + bounding.height;
                return i;
            });
        }, this.options.resizeEventBounce);
        // Runs on page scrolling
        this.scrollEvent = this.debounce(() => {
            // Watch scroll direction
            this.scrollDirection();
            // Watch section event events
            this.pageEvent();
            // Watch for element events
            this.elementEvents();
        }, this.options.scrollEventBounce);
        this.options = Object.assign(this.options, options);
        this.setupSections();
        this.pageEvent();
        window.addEventListener('scroll', this.scrollEvent.bind(this), true);
        window.addEventListener('resize', this.resizeEvent.bind(this), true);
    }
    /**
     * store changed event user is subscribed to
     */
    sectionStarted(cb) {
        this.events.sectionStarted = cb;
        this.callPageEnteredEvent(); // emit when registered
        return this;
    }
    /**
     * Add element for watching events
     */
    elementEvent(el, cb) {
        const bounding = el.getBoundingClientRect();
        this.elementsEvent.push({
            from: bounding.top,
            to: bounding.top + bounding.height,
            active: false,
            middleTriggered: false,
            el,
            cb
        });
        return this;
    }
    /**
     * Destroy
     */
    destroy() {
        window.removeEventListener('scroll', this.scrollEvent.bind(this), true);
        window.removeEventListener('resize', this.resizeEvent.bind(this), true);
        this.activeSection = null;
        this._scrollDirection = {
            direction: Direction.DOWN,
            lastScrollTop: 0
        };
        this.sections.splice(0, this.sections.length);
        this.elementsEvent.splice(0, this.elementsEvent.length);
        this.events = {};
    }
    /**
     * Caculate scroll direction
     */
    scrollDirection() {
        if (window.pageYOffset > this._scrollDirection.lastScrollTop) {
            this._scrollDirection.direction = Direction.DOWN;
        }
        else {
            this._scrollDirection.direction = Direction.UP;
        }
        this._scrollDirection.lastScrollTop = window.pageYOffset <= 0 ? 0 : window.pageYOffset;
    }
    /**
     * Section change
     */
    pageEvent() {
        // work out what section were on
        const sectionsY = this.sections.map(o => o.to);
        const sectionId = Math.max(...sectionsY.filter(e => window.scrollY >= e));
        const sectionIndex = sectionsY.indexOf(sectionId) + 1;
        if (!this.activeSection) {
            this.activeSection = this.sections[sectionIndex];
            this.callPageEnteredEvent();
        }
        else if (this.activeSection && this.activeSection.index !== sectionIndex) {
            this.activeSection = this.sections[sectionIndex];
            this.callPageEnteredEvent();
        }
    }
    /**
     * Check for element events within the screoll
     */
    elementEvents() {
        this.elementsEvent.forEach((i) => {
            if (!this.activeSection) {
                return;
            }
            const start = this.activeSection.to - i.to;
            const end = this.activeSection.to - i.from;
            const center = Math.round(((end - start) / 2) + start); // works for B
            if (!i.active && window.scrollY >= start && window.scrollY <= end) {
                // start down
                i.active = true;
                i.middleTriggered = false;
                i.cb(EventType.START, this._scrollDirection.direction, this.activeSection);
            }
            else if (i.active && window.scrollY < start || i.active && window.scrollY > end) {
                // end down
                i.active = false;
                i.middleTriggered = false;
                i.cb(EventType.END, this._scrollDirection.direction, this.activeSection);
            }
            // Middle
            if (i.active && !i.middleTriggered) {
                // console.log('ping', window.scrollY, center)
                if (this._scrollDirection.direction === Direction.DOWN && window.scrollY >= center ||
                    this._scrollDirection.direction === Direction.UP && window.scrollY <= center) {
                    i.middleTriggered = true;
                    i.cb(EventType.MIDDLE, this._scrollDirection.direction, this.activeSection);
                }
            }
        });
    }
    /**
     * Caculate the sections based on the document and store
     */
    setupSections() {
        this.sections = Array.from(window.document.querySelectorAll(this.options.selector)).map((el, index) => {
            // const from = Math.round(el.getBoundingClientRect().top) + window.scrollY + (this.options.offset ? this.options.offset : 0)
            const from = Math.round(el.getBoundingClientRect().top) + window.scrollY;
            const to = Math.round(el.getBoundingClientRect().top + el.clientHeight) + window.scrollY;
            return {
                from,
                to,
                classList: [].slice.apply(el.classList),
                index
            };
        });
    }
    /**
     * check and call changed event
     */
    callPageEnteredEvent() {
        if (!this.events.sectionStarted) {
            return;
        }
        // call changed event
        if (this.activeSection) {
            this.events.sectionStarted(this.activeSection, this._scrollDirection.direction);
        }
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
export default Sections;
