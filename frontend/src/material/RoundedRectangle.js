import React from 'react';

function renderStyle(background, color = "black"){
    return {
        background: background,
        borderRadius: 10,
        color: color,
        padding: 20,
        overflow: "hidden",
        display: "table"
    }
}

export function RoundedRectangle(props) {
    const { background, color, classes, children } = props;
    return (
        <div style={renderStyle(background, color)} classes={classes}>
            {children}
        </div>
    );
}