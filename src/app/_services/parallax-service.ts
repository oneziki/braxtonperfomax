import { IService } from './IService';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ParallaxService implements IService {

    constructor() { }

    getTitle = (): string => 'Parallax';

    getAllThemes = (): Array<any> => {
        return [
            { 'url': 'parallax/0', 'title': 'Product', 'theme': 'layout1' }
        ];
    }

    getDataForTheme = (menuItem: any): any => {
        return this[
            'getDataFor' +
            menuItem.theme.charAt(0).toUpperCase() +
            menuItem.theme.slice(1)
        ]();
    }

    //* Data Set for page 1
    getDataForLayout1 = (): any => {
        return {
            'toolbarTitle': 'Product',
            'imge': 'assets/imgs/background/19.png',
            'title': 'Nikon Df DSLR Camera with 50mm f/1.8 Lens (Silver)',
            'description': `Whether raising your game to SLR level photography or having fun with a feature-rich, versatile SLR you can use pretty much anywhere, the EOS 80D camera is your.`,
            'price': '$1,195.00',
            'instock': 'In Stock',
            'button': 'Add to Cart',
            'items': [
                {
                    'id': 1,
                    'image': 'assets/imgs/background/shop-1.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 2,
                    'image': 'assets/imgs/background/shop-2.jpg',
                    'title': 'Macbook Air',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 3,
                    'image': 'assets/imgs/background/shop-3.jpg',
                    'title': 'Macbook Air',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 4,
                    'image': 'assets/imgs/background/shop-4.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 5,
                    'image': 'assets/imgs/background/shop-5.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 6,
                    'image': 'assets/imgs/background/shop-6.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 7,
                    'image': 'assets/imgs/background/shop-7.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 8,
                    'image': 'assets/imgs/background/shop-1.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 9,
                    'image': 'assets/imgs/background/shop-2.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                },
                {
                    'id': 10,
                    'image': 'assets/imgs/background/shop-5.jpg',
                    'title': 'Nikon DF Retro',
                    'numberProducts': '123 Products'
                }
            ]
        };
    }

    load(): Observable<any> {
        return new Observable(observer => {
            observer.next(this.getDataForLayout1());
            observer.complete();
        });
    }
}
