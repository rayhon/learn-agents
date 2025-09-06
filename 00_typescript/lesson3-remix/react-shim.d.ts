declare var React: {
    createElement: (tag: string, props: any, ...children: any[]) => any;
}

declare namespace JSX {
    interface IntrinsicElements {
        div: any;
        h1: any;
        ul: any;
        li: any;
    }
}