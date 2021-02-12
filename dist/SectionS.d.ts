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
     * Will run on scroll
     */
    private scrollEvent;
    /**
     * check and call changed event
     */
    private callChangedEvent;
}
export default SectionS;
