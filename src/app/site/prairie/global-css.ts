import { CssManager, hson } from "hson-live";


export function set_global_css() {
    const BP_TABLET = "(max-width: 900px)";
    const BP_PHONE = "(max-width: 620px)";
    const css = CssManager.globals.invoke();

    /* base / desktop */
    // css.sel("#page-host").setMany({
    //     position: "absolute",
    //     inset: "0",
    //     display: "grid",
    //     gridTemplateColumns: "1fr 1fr",
    //     minWidth: "0",
    //     minHeight: "0",
    // });

    // css.sel("#menu-panel").setMany({
    //     position: "relative",
    //     minWidth: "0",
    //     minHeight: "0",
    // });

    // css.sel("#content-panel").setMany({
    //     position: "relative",
    //     minWidth: "0",
    //     minHeight: "0",
    // });

    // css.sel("#menu-box").setMany({
    //     marginTop: "25%",
    //     marginLeft: "2rem",
    // });

    // css.sel("#content-panel .content.box").setMany({
    //     width: "100%",
    //     height: "100%",
    // });

    /* tablet: stack menu above content */
    css.media(BP_TABLET).sel("div#page-host").setMany({
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto minmax(0, 1fr)",
    });

    css.media(BP_TABLET).sel("div#menu-panel").setMany({
        gridRow: "1",
    });

    css.media(BP_TABLET).sel("div#content-panel").setMany({
        gridRow: "2",
    });

    css.media(BP_TABLET).sel("div#menu-box").setMany({
        margin: "2rem",
    });

    css.media(BP_TABLET).sel("div#content-panel .content.box").setMany({
        width: "min(92vw, 46rem)",
        height: "min(70vh, 42rem)",
        marginInline: "auto",
    });

    /* phone: compress header/menu and give content more vertical room */
    css.media(BP_PHONE).sel("div#page-host").setMany({
        gridTemplateRows: "auto minmax(0, 1fr)",
    });

    css.media(BP_PHONE).sel("#menu-box").setMany({
        marginTop: "1rem",
        marginLeft: "1rem",
        marginRight: "1rem",
        margin: "2rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
    });

    css.media(BP_PHONE).sel("#menu-box .logo").setMany({
        display: "block",
        marginBottom: "0.25rem",
        gridColumn: "1",
        textAlign: "right",
    });
    css.media(BP_PHONE).sel("span#link-box").setMany({
        gridColumn: "2",
        display: "flex",
        flexDirection: "column"
    });
    css.media(BP_PHONE).sel("#content-panel .content.box").setMany({
        width: "calc(100vw - 1.5rem)",
        height: "calc(100vh - 9rem)",
        marginInline: "auto",
    });
}