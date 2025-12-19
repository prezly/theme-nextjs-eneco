interface Props {
    variables: Record<string, string>;
}

export function InjectCssVariables({ variables }: Props) {
    const css = Object.entries(variables)
        .map(([variable, value]) => {
            // Add fallback for font-family variables to ensure Etelka Medium is always used
            if (variable === '--prezly-font-family' || variable === '--prezly-font-family-secondary') {
                return `${variable}: ${value}, 'Etelka Medium', sans-serif`;
            }
            return `${variable}: ${value}`;
        })
        .join(';\n');

    // biome-ignore lint/security/noDangerouslySetInnerHtml: <...>
    return <style dangerouslySetInnerHTML={{ __html: `:root { ${css} }` }} />;
}
