export interface Options {
    selector: string;
    offset: number | null;
    has: string | null;
}
declare type ChangeEvent = (sectionIndex: number, hasResult?: boolean) => void;
declare class SectionS {
    private readonly options;
    private currentSection;
    private sections;
    private events;
    /**
     * Runs on window resize
     */
    private resizeEvent;
    /**
     * Runs on page scrolling
     */
    private scrollEvent;
    /**
     * init
     */
    constructor(options?: Partial<Options>);
    /**
     * store changed event user is subscribed to
     */
    changed(cb: ChangeEvent): void;
    /**
     * Destroy
     */
    destroy(): void;
    /**
     * Caculate the sections based on the document and store
     */
    private setupSections;
    /**
     * check and call changed event
     */
    private callChangedEvent;
    /**
     * Bounce functions. Prevent methods from being called to many times
     */
    private debounce;
}
export default SectionS;
