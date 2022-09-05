import { BasicList, ListContext, ListItem, Neovim } from 'coc.nvim'
import fs from 'fs'
import path from 'path'



export default class Workspaces extends BasicList {
  public readonly name = 'workspaces'
  public readonly description = 'workspaces'
  public readonly defaultAction = 'cd'

  constructor(nvim: Neovim) {
     super(nvim)
     this.addAction('cd', item => {
        console.log(item.data)
        nvim.command(`cd ${item.data.workspace_path}`, true)
        nvim.command(`let t:wd = getcwd()`, true)
     })
     this.addLocationActions()
  }

  public async loadItems(_context: ListContext): Promise<ListItem[]> {
    let result: ListItem[] = []

    await new Promise<void>(resolve => {
       fs.readFile(path.dirname(__dirname) + '/workspaces.json', 'utf8', (err, content) => {
          if (err)
             return console.log(err)
          let content_json = JSON.parse(content)
          for (let workspace_name in content_json) {
             let workspace_path = content_json[workspace_name]
             result.push({
                label: `${workspace_name}\t${workspace_path}`,
                filterText: workspace_name,
                data: { workspace_path }
             })
          }
         resolve()
       })
    })
    return result
  }
}
   
