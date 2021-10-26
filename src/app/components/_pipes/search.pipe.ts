import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'searchPipe'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], textToSearch: string, searchCriteria1: string = '', searchCriteria2: string = '', searchCriteria3: string = ''): any[] {

    /* ------------------

     _serchText is the text to search on, keytosearchon is the object key name.

    to search on one key use :
    example >>>>  | searchPipe: _searchText : 'keytosearchon1'

    to search on two keys use :
    example >>>>  | searchPipe: _searchText : 'keytosearchon1': 'keytosearchon2'

    --------------------- */

    //  if object is empty return empty obj
    if (!items) return [];
    //  if text search is empty return full object
    if (!textToSearch) return items;
    if (textToSearch === 'All') return items;

    textToSearch = textToSearch.toLowerCase();
    let filteredItems = []

    items.filter(item => {

      if (item[searchCriteria1].toLowerCase().includes(textToSearch)) {
        filteredItems.push(item);
      } else if (searchCriteria2 !== undefined && searchCriteria2 !== '') {
        
        if (item[searchCriteria2].toLowerCase().includes(textToSearch)) {
          filteredItems.push(item);
        }
      } else if (searchCriteria3 !== undefined && searchCriteria3 !== '') {
        if (item[searchCriteria3].toLowerCase().includes(textToSearch)) {
          filteredItems.push(item);
        }
      }


      if (item['outcomes']) {
        item.outcomes.forEach(Outcome => {
          if (Outcome['sOutcomeName'].toLowerCase().includes(textToSearch)) {
            filteredItems.push(item);
          }
          Outcome['indicators'].forEach(indicator => {
            if (indicator['sIndicatorName'].toLowerCase().includes(textToSearch)) {
              filteredItems.push(item);
            }
          });
        });

      }

    });
    return filteredItems;
  }
}