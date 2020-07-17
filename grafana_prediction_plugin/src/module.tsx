import {PanelPlugin} from '@grafana/data';
import Editor from './view/editor'
import Panel from "./view/panel";


export const plugin = new PanelPlugin(Panel);
plugin.setEditor(Editor);
// plugin.setDefaults({
//     controller: new Controller()
// })

