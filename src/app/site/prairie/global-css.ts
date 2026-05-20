import { CssManager, hson } from "hson-live";


export function set_global_css() {
    const BP_TABLET = "(max-width: 900px)";
    const BP_PHONE = "(max-width: 620px)";
    const css = CssManager.globals.invoke();
    
    css.sel("html, body").setMany({
        margin: "0",
        padding: "0",
        width: "100%",
        minHeight: "100%",
    });

    /* tablet: stack menu above content */
    css.media(BP_TABLET).sel("div#page-host").setMany({
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto minmax(0, 1fr)",
    });
    css.media(BP_TABLET).sel("div#menu-panel").setMany({
        gridRow: "1",
        gridTemplateColumns: "1fr 1fr 1fr"
    });

    css.media(BP_TABLET).sel("div#content-panel").setMany({
        gridRow: "2",
    });

    css.media(BP_TABLET).sel("div#menu-box").setMany({

        margin: "1rem",
        // marginBottom: "2rem",
    });

    css.media(BP_TABLET).sel("span#link-box").setMany({
        gridRow: "2",
        gridColumn: "1",
        display: "flex",
        flexDirection: "column"
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
        gridTemplateRows: "1fr 1fr",
        gridTemplateColumns: "1fr",
    });

    css.media(BP_PHONE).sel("#menu-box .logo").setMany({
        display: "block",
        marginBottom: "0.25rem",
        gridRow: "1",
        gridColumn: "1",
        alignSelf: "center"
    });
    css.media(BP_PHONE).sel("span#link-box").setMany({
        gridRow: "2",
        gridColumn: "1",
        display: "flex",
        flexDirection: "row"
    });
    css.media(BP_PHONE).sel("#content-panel .content.box").setMany({
        width: "calc(100vw - 1.5rem)",
        height: "calc(100vh - 9rem)",
        marginInline: "auto",
    });
}