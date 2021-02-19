export interface Options {
    selector: string;
}
export declare type sectionStartedEvent = (section: SectionInterface, direction: Direction) => void;
export declare type elementsInterfaceEvent = (type: EventType, direction: Direction, currentSection: SectionInterface) => void;
export interface SectionInterface {
    index: number;
    from: number;
    to: number;
    classList: string[];
}
export declare enum EventType {
    START = "start",
    MIDDLE = "middle",
    END = "end"
}
export interface ElementsInterface {
    from: number;
    to: number;
    active: boolean;
    middleTriggered: boolean;
    el: HTMLElement | Element;
    cb: elementsInterfaceEvent;
}
export interface ScrollDirectionInterface {
    direction: Direction;
    lastScrollTop: number;
}
export declare enum Direction {
    UP = "up",
    DOWN = "down"
}
declare class Sections {
    private readonly options;
    private activeSection;
    private _scrollDirection;
    private sections;
    private elementsEvent;
    private events;
    private resizeEvent;
    private scrollEvent;
    /**
     * init
     */
    constructor(options?: Partial<Options>);
    /**
     * store changed event user is subscribed to
     */
    sectionStarted(cb: sectionStartedEvent): Sections;
    /**
     * Add element for watching events
     */
    elementEvent(el: HTMLElement | Element, cb: elementsInterfaceEvent): Sections;
    /**
     * Destroy
     */
    destroy(): void;
    /**
     * Caculate scroll direction
     */
    private scrollDirection;
    /**
     * Section change
     */
    private pageEvent;
    /**
     * Check for element events within the screoll
     */
    private elementEvents;
    /**
     * Caculate the sections based on the document and store
     */
    private setupSections;
    /**
     * check and call changed event
     */
    private callPageEnteredEvent;
    /**
     * Bounce functions. Prevent methods from being called to many times
     */
    private debounce;
}
export default Sections;
