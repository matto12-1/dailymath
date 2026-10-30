// 그림 파일 목록. 4권에서 그림이 들어오면 여기에 이름만 더한다. 없는 그림은 null → 화면은 이름표만 보인다(도형·이모지로 때우지 않는다).
// 동작 그림이 들어오면 FRAMES와 FRAME_FILES에 가진 묶음과 파일을 적는다.
// 주민 번호는 look.variant(0..39), 파일 번호는 01..40이다.
const residentPaths = (kind) => Array.from({ length: 40 }, (_, i) => `img/residents/${kind}-${String(i + 1).padStart(2, '0')}.png`);
export const ASSETS = {
  residents: { cat: residentPaths('cat'), dog: residentPaths('dog') },
  scenes: {"share":"img/scenes/share.png","candy-receive":"img/scenes/candy-receive.d609732f0f1f.webp","pencil-bundles":"img/scenes/pencil-bundles.eab8218d2775.webp","sticker-share":"img/scenes/sticker-share.52ac250747b0.webp","stepping-playground":"img/scenes/stepping-playground.04b03b7cb524.webp","sticker-collect":"img/scenes/sticker-collect.236b71f0a7c0.webp","candy-bags":"img/scenes/candy-bags.52f6fc1d9809.webp","flower-bundles":"img/scenes/flower-bundles.09db3ed4126b.webp","cord-cutting":"img/scenes/cord-cutting.f72f1eb77d29.webp","playground-play":"img/scenes/playground-play.67893a394f92.webp","classroom-chairs":"img/scenes/classroom-chairs.73891ff2dd13.webp","library-shelves":"img/scenes/library-shelves.9e6c11659e61.webp","candy-sharing":"img/scenes/candy-sharing.49d69a033052.webp","bread-boxes":"img/scenes/bread-boxes.82d5d2c81d5f.webp","running":"img/scenes/running.34cbbac0faed.webp","notebook-boxes":"img/scenes/notebook-boxes.ffe97bec9709.webp","wooden-disc":"img/scenes/wooden-disc.f343718e62c8.webp","water-container":"img/scenes/water-container.097a8382c6cd.webp","candy-fractions":"img/scenes/candy-fractions.a6457a297d61.webp","shop":"img/scenes/shop.64fba945c787.webp","fans-open":"img/scenes/fans-open.802155f0b58e.webp","library-boxes":"img/scenes/library-boxes.0addba5bb1ad.webp","cord-fraction":"img/scenes/cord-fraction.6561e3690e26.webp","juice-pouring":"img/scenes/juice-pouring.573dbf7f95d3.webp","craft":"img/scenes/craft.ce3929cc426e.webp","flour-baking":"img/scenes/flour-baking.b21ae010dcd6.webp","pencil-sharing":"img/scenes/pencil-sharing.0f030019f82d.webp","gift-packs":"img/scenes/gift-packs.b9747324902f.webp","drink-bottles":"img/scenes/drink-bottles.5d0cb3b3cd35.webp","garden-triangle":"img/scenes/garden-triangle.dc9cb1d2a713.webp","bus-stop":"img/scenes/bus-stop.e435f1ecdfb2.webp","chance-bag":"img/scenes/chance-bag.96ec6110da08.webp","flower-harvest":"img/scenes/flower-harvest.8639793d3558.webp","birthday":"img/scenes/birthday.9e759459e391.webp","shipping-box":"img/scenes/shipping-box.29bd77dd7f66.webp","library-visitors":"img/scenes/library-visitors.119330c3d46c.webp","candy-ratio":"img/scenes/candy-ratio.bc698ce391f3.webp","grain-sharing":"img/scenes/grain-sharing.232cb9ec7443.webp","garden-round":"img/scenes/garden-round.8e449acd03fb.webp"},
  items: {"fountain":"img/items/fountain.37622e8d6d63.webp","bench":"img/items/bench.9710e1ba16ee.webp","lamp":"img/items/lamp.f11d97720e93.webp","tree":"img/items/tree.5abfa4fcf6ba.webp","flower":"img/items/item-flower.fc7be2596029.webp","mailbox":"img/items/item-mailbox.7e98b2e28b83.webp","table":"img/items/item-table.e0b35aef3c3c.webp","well":"img/items/item-well.c9ad399759c9.webp","house-small":"img/items/house-small.8a7ef992bdac.webp","house-big":"img/items/house-big.62ba86ec147f.webp"},
};

export const residentImg = (kind, variant = 0) => Number.isInteger(variant) ? ASSETS.residents[kind]?.[variant] ?? null : null;
export const sceneImg = (scene) => ASSETS.scenes[scene] ?? null;
export const itemImg = (id) => ASSETS.items[id] ?? null;

// Generated from approved restyle PNGs by tools/shops-webp.mjs.
export const SHOP_ART = {
  "bakery": {
    "src": [
      "img/shops/bakery-1.8cafba9435ce.webp",
      "img/shops/bakery-2.e54c5361af1d.webp",
      "img/shops/bakery-3.30c4ad56e638.webp"
    ],
    "icon": "img/shops/bakery-icon.c55281fc0d77.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 721
    },
    "bases": [
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      378,
      553,
      592
    ],
    "boxes": [
      {
        "l": 22.526041666666664,
        "t": 28.125,
        "r": 77.47395833333334,
        "b": 93.88020833333334
      },
      {
        "l": 11.848958333333332,
        "t": 28.90625,
        "r": 88.15104166666666,
        "b": 93.88020833333334
      },
      {
        "l": 8.723958333333332,
        "t": 2.864583333333333,
        "r": 91.40625,
        "b": 93.88020833333334
      }
    ]
  },
  "flower": {
    "src": [
      "img/shops/flower-1.598c17260a16.webp",
      "img/shops/flower-2.c6f0336b24d6.webp",
      "img/shops/flower-3.f14cb2a78221.webp"
    ],
    "icon": "img/shops/flower-icon.fafbd9091b41.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 722
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      394,
      550,
      583
    ],
    "boxes": [
      {
        "l": 24.088541666666664,
        "t": 26.692708333333332,
        "r": 75.78125,
        "b": 94.01041666666666
      },
      {
        "l": 13.411458333333334,
        "t": 29.947916666666668,
        "r": 86.45833333333334,
        "b": 93.88020833333334
      },
      {
        "l": 11.067708333333332,
        "t": 3.125,
        "r": 88.80208333333334,
        "b": 94.01041666666666
      }
    ]
  },
  "fruit": {
    "src": [
      "img/shops/fruit-1.6ede40c07529.webp",
      "img/shops/fruit-2.c51f144875ed.webp",
      "img/shops/fruit-3.49b3ff7da34d.webp"
    ],
    "icon": "img/shops/fruit-icon.6b2162ea11a7.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 721
    },
    "bases": [
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 722
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      376,
      514,
      558
    ],
    "boxes": [
      {
        "l": 23.177083333333336,
        "t": 31.25,
        "r": 76.82291666666666,
        "b": 93.88020833333334
      },
      {
        "l": 14.583333333333334,
        "t": 26.302083333333332,
        "r": 85.41666666666666,
        "b": 93.88020833333334
      },
      {
        "l": 10.807291666666668,
        "t": 2.213541666666667,
        "r": 89.19270833333334,
        "b": 94.01041666666666
      }
    ]
  },
  "cafe": {
    "src": [
      "img/shops/cafe-1.200535e58c3a.webp",
      "img/shops/cafe-2.836ad0082f6c.webp",
      "img/shops/cafe-3.22085d2ae04f.webp"
    ],
    "icon": "img/shops/cafe-icon.a22cad7f9f05.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 722
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      361,
      514,
      534
    ],
    "boxes": [
      {
        "l": 24.479166666666664,
        "t": 27.083333333333332,
        "r": 75.52083333333334,
        "b": 94.01041666666666
      },
      {
        "l": 13.671875,
        "t": 30.729166666666668,
        "r": 86.328125,
        "b": 93.88020833333334
      },
      {
        "l": 11.067708333333332,
        "t": 4.166666666666666,
        "r": 89.19270833333334,
        "b": 94.01041666666666
      }
    ]
  },
  "fish": {
    "src": [
      "img/shops/fish-1.0b995038a39b.webp",
      "img/shops/fish-2.d9dc34bd7a81.webp",
      "img/shops/fish-3.5aa668bc348d.webp"
    ],
    "icon": "img/shops/fish-icon.1d00b40ebb06.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      356,
      547,
      545
    ],
    "boxes": [
      {
        "l": 22.786458333333336,
        "t": 35.15625,
        "r": 77.34375,
        "b": 94.01041666666666
      },
      {
        "l": 11.979166666666668,
        "t": 31.510416666666668,
        "r": 88.02083333333334,
        "b": 94.01041666666666
      },
      {
        "l": 12.890625,
        "t": 6.380208333333333,
        "r": 86.97916666666666,
        "b": 93.88020833333334
      }
    ]
  },
  "snack": {
    "src": [
      "img/shops/snack-1.75807c601e16.webp",
      "img/shops/snack-2.0c4e8ce342b2.webp",
      "img/shops/snack-3.b881e3c83507.webp"
    ],
    "icon": "img/shops/snack-icon.0311eb452e3f.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 721
    },
    "bases": [
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      356,
      543,
      546
    ],
    "boxes": [
      {
        "l": 24.479166666666664,
        "t": 24.348958333333336,
        "r": 75.52083333333334,
        "b": 93.88020833333334
      },
      {
        "l": 14.713541666666666,
        "t": 29.166666666666668,
        "r": 85.41666666666666,
        "b": 93.88020833333334
      },
      {
        "l": 11.979166666666668,
        "t": 5.078125,
        "r": 88.15104166666666,
        "b": 93.88020833333334
      }
    ]
  },
  "books": {
    "src": [
      "img/shops/books-1.72181ef315e7.webp",
      "img/shops/books-2.90824db8ffba.webp",
      "img/shops/books-3.b510f52df243.webp"
    ],
    "icon": "img/shops/books-icon.d857e822afae.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      393,
      522,
      599
    ],
    "boxes": [
      {
        "l": 23.958333333333336,
        "t": 25.390625,
        "r": 76.04166666666666,
        "b": 94.01041666666666
      },
      {
        "l": 14.453125,
        "t": 26.953125,
        "r": 85.67708333333334,
        "b": 93.88020833333334
      },
      {
        "l": 9.635416666666668,
        "t": 8.333333333333332,
        "r": 90.234375,
        "b": 93.88020833333334
      }
    ]
  },
  "post": {
    "src": [
      "img/shops/post-1.73f3407cb3a2.webp",
      "img/shops/post-2.d263e4723c7e.webp",
      "img/shops/post-3.b7d85e51a2a3.webp"
    ],
    "icon": "img/shops/post-icon.a6c58dccc12a.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      381,
      531,
      533
    ],
    "boxes": [
      {
        "l": 23.4375,
        "t": 26.692708333333332,
        "r": 76.69270833333334,
        "b": 94.01041666666666
      },
      {
        "l": 13.671875,
        "t": 27.34375,
        "r": 86.45833333333334,
        "b": 93.88020833333334
      },
      {
        "l": 13.932291666666666,
        "t": 11.979166666666668,
        "r": 86.328125,
        "b": 93.88020833333334
      }
    ]
  },
  "icecream": {
    "src": [
      "img/shops/icecream-1.38ab708bfdcd.webp",
      "img/shops/icecream-2.14360bd4ddba.webp",
      "img/shops/icecream-3.1afe6a274af0.webp"
    ],
    "icon": "img/shops/icecream-icon.4f4b0d3142eb.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 721
    },
    "bases": [
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      386,
      513,
      547
    ],
    "boxes": [
      {
        "l": 22.526041666666664,
        "t": 23.958333333333336,
        "r": 77.734375,
        "b": 93.88020833333334
      },
      {
        "l": 13.541666666666666,
        "t": 27.34375,
        "r": 86.45833333333334,
        "b": 93.88020833333334
      },
      {
        "l": 10.677083333333332,
        "t": 11.848958333333332,
        "r": 89.32291666666666,
        "b": 93.88020833333334
      }
    ]
  },
  "groom": {
    "src": [
      "img/shops/groom-1.f772247b431b.webp",
      "img/shops/groom-2.a7f8d3533177.webp",
      "img/shops/groom-3.af325f564edf.webp"
    ],
    "icon": "img/shops/groom-icon.70a49618a929.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 721
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      402,
      508,
      547
    ],
    "boxes": [
      {
        "l": 22.265625,
        "t": 29.817708333333332,
        "r": 77.60416666666666,
        "b": 94.01041666666666
      },
      {
        "l": 13.802083333333334,
        "t": 32.8125,
        "r": 86.06770833333334,
        "b": 94.01041666666666
      },
      {
        "l": 10.416666666666668,
        "t": 4.036458333333334,
        "r": 89.32291666666666,
        "b": 93.88020833333334
      }
    ]
  },
  "yarn": {
    "src": [
      "img/shops/yarn-1.1ba9d4983cb8.webp",
      "img/shops/yarn-2.272f31d6adaf.webp",
      "img/shops/yarn-3.b7efbd1bc16f.webp"
    ],
    "icon": "img/shops/yarn-icon.6a5a1745175b.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 721
    },
    "bases": [
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 721
      },
      {
        "x": 384,
        "y": 722
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      407,
      524,
      532
    ],
    "boxes": [
      {
        "l": 22.395833333333336,
        "t": 32.8125,
        "r": 77.60416666666666,
        "b": 93.88020833333334
      },
      {
        "l": 13.020833333333334,
        "t": 34.24479166666667,
        "r": 86.84895833333334,
        "b": 93.88020833333334
      },
      {
        "l": 11.197916666666668,
        "t": 5.729166666666666,
        "r": 88.671875,
        "b": 94.01041666666666
      }
    ]
  },
  "toy": {
    "src": [
      "img/shops/toy-1.139beb2f386e.webp",
      "img/shops/toy-2.9426f360a0e4.webp",
      "img/shops/toy-3.dcb19ef62a64.webp"
    ],
    "icon": "img/shops/toy-icon.f84ae79ccbe2.webp",
    "canvas": 768,
    "base": {
      "x": 384,
      "y": 722
    },
    "bases": [
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 722
      },
      {
        "x": 384,
        "y": 722
      }
    ],
    "bigBase": 576,
    "baseWidths": [
      374,
      549,
      571
    ],
    "boxes": [
      {
        "l": 23.958333333333336,
        "t": 33.59375,
        "r": 76.04166666666666,
        "b": 94.01041666666666
      },
      {
        "l": 11.979166666666668,
        "t": 27.994791666666668,
        "r": 88.15104166666666,
        "b": 94.01041666666666
      },
      {
        "l": 9.895833333333332,
        "t": 4.427083333333334,
        "r": 90.234375,
        "b": 94.01041666666666
      }
    ]
  }
};
export const SIGN_ART = {"src":"img/shops/signpost.e0cf3abd77d4.webp","canvas":384,"box":{"l":8.854166666666668,"t":10.677083333333332,"r":91.14583333333334,"b":92.96875},"base":{"x":192,"y":357},"baseWidth":54,"source":"docs/concepts/village-shops/restyle/signpost-55d61aad5cd1.png","sourceHash":"55d61aad5cd1f169f93cab0c5006571b50d973a0db385ba3ae88da987332846d","panel":{"x":60,"y":108,"width":264,"height":64},"height":3.5316230632461267};
export const HOUSE_ART = {
  "small": {
    "src": "img/items/house-small.8a7ef992bdac.webp",
    "canvas": 384,
    "box": {
      "l": 6.25,
      "t": 11.197916666666668,
      "r": 93.75,
      "b": 88.54166666666666
    },
    "base": {
      "x": 192,
      "y": 340
    },
    "baseWidth": 303,
    "source": "docs/concepts/village-shops/restyle/house-small-9d5c70a5d0f6.png",
    "sourceHash": "9d5c70a5d0f623e3e97930a9c9c6273b9bc11644fb2338b690aa0df4174055ea",
    "height": 8.393855643044619
  },
  "big": {
    "src": "img/items/house-big.62ba86ec147f.webp",
    "canvas": 384,
    "box": {
      "l": 5.989583333333334,
      "t": 8.59375,
      "r": 94.01041666666666,
      "b": 91.40625
    },
    "base": {
      "x": 192,
      "y": 351
    },
    "baseWidth": 297,
    "source": "docs/concepts/village-shops/restyle/house-big-e18c0e4698f6.png",
    "sourceHash": "e18c0e4698f6502b92802eee4d8a937b3d19055e7314ec5093cb00b834831b5a",
    "height": 8.978635170603674
  }
};
export const PROP_ART = {
  "fountain": {
    "src": "img/items/fountain.37622e8d6d63.webp",
    "canvas": 384,
    "box": {
      "l": 4.947916666666666,
      "t": 9.635416666666668,
      "r": 95.05208333333334,
      "b": 92.44791666666666
    },
    "base": {
      "x": 192,
      "y": 355
    },
    "baseWidth": 327,
    "source": "docs/concepts/village-shops/restyle/fountain-2b0937821179.png",
    "sourceHash": "2b0937821179a01501429ce036f26a22a85a92adb59c371c537120e8c02c35d2",
    "height": 5.590551181102362
  },
  "bench": {
    "src": "img/items/bench.9710e1ba16ee.webp",
    "canvas": 384,
    "box": {
      "l": 6.510416666666667,
      "t": 9.114583333333332,
      "r": 93.48958333333334,
      "b": 89.84375
    },
    "base": {
      "x": 192,
      "y": 345
    },
    "baseWidth": 305,
    "source": "docs/concepts/village-shops/restyle/bench-41400ef438e9.png",
    "sourceHash": "41400ef438e91995f4aa34558d10ce2515d330bbc1f77ad1e731bd03e09150bc",
    "height": 3.4645669291338583
  },
  "lamp": {
    "src": "img/items/lamp.f11d97720e93.webp",
    "canvas": 384,
    "box": {
      "l": 35.41666666666667,
      "t": 3.125,
      "r": 64.0625,
      "b": 94.01041666666666
    },
    "base": {
      "x": 191.5,
      "y": 361
    },
    "baseWidth": 66,
    "source": "docs/concepts/village-shops/restyle/lamp-f2e6f530cb03.png",
    "sourceHash": "f2e6f530cb03fbbab1dd85d6df7eb7109499d220a9add1ef7b640e0c7b5f429f",
    "height": 4.776902887139108
  },
  "tree": {
    "src": "img/items/tree.5abfa4fcf6ba.webp",
    "canvas": 384,
    "box": {
      "l": 11.979166666666668,
      "t": 6.770833333333333,
      "r": 87.5,
      "b": 94.01041666666666
    },
    "base": {
      "x": 191.5,
      "y": 361
    },
    "baseWidth": 129,
    "source": "docs/concepts/village-shops/restyle/tree-d16a76ee770e.png",
    "sourceHash": "d16a76ee770ee954d5b225ce25fa44e70763394e8df8ad115f968f916f4bbc05",
    "height": 4.934383202099737
  },
  "flower": {
    "src": "img/items/item-flower.fc7be2596029.webp",
    "canvas": 384,
    "box": {
      "l": 5.46875,
      "t": 22.395833333333336,
      "r": 94.53125,
      "b": 77.86458333333334
    },
    "base": {
      "x": 192,
      "y": 299
    },
    "baseWidth": 310,
    "source": "docs/concepts/village-shops/restyle/item-flower-5f1cbc91fd48.png",
    "sourceHash": "5f1cbc91fd486b35834ed119627b2fbf95def265ce58a49922581f4b38331ad4",
    "height": 2.380492760985522
  },
  "mailbox": {
    "src": "img/items/item-mailbox.7e98b2e28b83.webp",
    "canvas": 384,
    "box": {
      "l": 20.833333333333336,
      "t": 6.25,
      "r": 78.64583333333334,
      "b": 94.01041666666666
    },
    "base": {
      "x": 191.5,
      "y": 361
    },
    "baseWidth": 45,
    "source": "docs/concepts/village-shops/restyle/item-mailbox-aa45b1ab9f6c.png",
    "sourceHash": "aa45b1ab9f6cde750ae0d73d478fe7067b8cebf0f09b10805647ffbdb87d9682",
    "height": 3.7663195326390655
  },
  "table": {
    "src": "img/items/item-table.e0b35aef3c3c.webp",
    "canvas": 384,
    "box": {
      "l": 5.989583333333334,
      "t": 19.791666666666664,
      "r": 94.01041666666666,
      "b": 79.94791666666666
    },
    "base": {
      "x": 192,
      "y": 307
    },
    "baseWidth": 312,
    "source": "docs/concepts/village-shops/restyle/item-table-03559d19cea4.png",
    "sourceHash": "03559d19cea4b9d2a569e2c158c6dde3faa9ed1a0ce3f6fb42d1444417f7f4ce",
    "height": 2.5816611633223263
  },
  "well": {
    "src": "img/items/item-well.c9ad399759c9.webp",
    "canvas": 384,
    "box": {
      "l": 13.541666666666666,
      "t": 7.03125,
      "r": 86.71875,
      "b": 94.01041666666666
    },
    "base": {
      "x": 192,
      "y": 361
    },
    "baseWidth": 217,
    "source": "docs/concepts/village-shops/restyle/item-well-61000682969e.png",
    "sourceHash": "61000682969e95d6563ceab7570b1cae466b191b21ac7d051d1930f3b4a592b4",
    "height": 3.732791465582931
  }
};
export const ART_BYTE_LIMITS = {"shop":96128,"icon":18368,"item":30742,"sign":12598};

// 일하는 그림(work-1~3)은 256칸, 옆·앞·뒤 걷는 그림은 192칸이다.
// 번호는 look.variant(0부터). 그림이 없는 주민은 null → 마을은 앉은 그림을 코드로 움직인다.
// tools/frames-webp.mjs가 원본을 보존하고 반 크기와 내용 해시로 앱용 파일을 만든다.
export const FRAMES = {"cat":{"0":["work","walk","front","back"],"1":["work","walk","front","back"],"2":["work","walk","front","back"],"3":["work","walk","front","back"],"4":["work","walk","front","back"],"5":["work","walk","front","back"],"6":["work","walk","front","back"],"7":["work","walk","front","back"],"8":["work","walk","front","back"],"9":["work","walk","front","back"],"10":["work","walk","front","back"],"11":["work","walk","front","back"],"12":["work","walk","front","back"],"13":["work","walk","front","back"],"14":["work","walk","front","back"],"15":["work","walk","front","back"],"16":["work","walk","front","back"],"17":["work","walk","front","back"],"18":["work","walk","front","back"],"19":["work","walk","front","back"],"20":["work","walk","front","back"],"21":["work","walk","front","back"],"22":["work","walk","front","back"],"23":["work","walk","front","back"],"24":["work","walk","front","back"],"25":["work","walk","front","back"],"26":["work","walk","front","back"],"27":["work","walk","front","back"],"28":["work","walk","front","back"],"29":["work","walk","front","back"],"30":["work","walk","front","back"],"31":["work","walk","front","back"],"32":["work","walk","front","back"],"33":["work","walk","front","back"],"34":["work","walk","front","back"],"35":["work","walk","front","back"],"36":["work","walk","front","back"],"37":["work","walk","front","back"],"38":["work","walk","front","back"],"39":["work","walk","front","back"]},"dog":{"0":["work","walk","front","back"],"1":["work","walk","front","back"],"2":["work","walk","front","back"],"3":["work","walk","front","back"],"4":["work","walk","front","back"],"5":["work","walk","front","back"],"6":["work","walk","front","back"],"7":["work","walk","front","back"],"8":["work","walk","front","back"],"9":["work","walk","front","back"],"10":["work","walk","front","back"],"11":["work","walk","front","back"],"12":["walk","front","back"],"13":["work","walk","front","back"],"14":["work","walk","front","back"],"15":["work","walk","front","back"],"16":["work","walk","front","back"],"17":["work","walk","front","back"],"18":["work","walk","front","back"],"19":["work","walk","front","back"],"20":["work","walk","front","back"],"21":["work","walk","front","back"],"22":["work","walk","front","back"],"23":["work","walk","front","back"],"24":["work","walk","front","back"],"25":["work","walk","front","back"],"26":["work","walk","front","back"],"27":["work","walk","front","back"],"28":["work","walk","front","back"],"29":["work","walk","front","back"],"30":["work","walk","front","back"],"31":["work","walk","front","back"],"32":["work","walk","front","back"],"33":["work","walk","front","back"],"34":["work","walk","front","back"],"35":["work","walk","front","back"],"36":["work","walk","front","back"],"37":["work","walk","front","back"],"38":["work","walk","front","back"],"39":["work","walk","front","back"]}};
export const FRAME_FILES = {
  "cat": {
    "0": {
      "work-1": "img/residents/motion/cat-01/work-1.d4f70960936f.webp",
      "work-2": "img/residents/motion/cat-01/work-2.f4b5b4f3b690.webp",
      "work-3": "img/residents/motion/cat-01/work-3.354a4e24c057.webp",
      "walk-1": "img/residents/motion/cat-01/walk-1.b1e5d22f0662.webp",
      "walk-2": "img/residents/motion/cat-01/walk-2.c1abd786961f.webp",
      "front-1": "img/residents/motion/cat-01/front-1.c89d528dfe28.webp",
      "front-2": "img/residents/motion/cat-01/front-2.499341c33577.webp",
      "back-1": "img/residents/motion/cat-01/back-1.b99050519d86.webp",
      "back-2": "img/residents/motion/cat-01/back-2.450884439bb5.webp"
    },
    "1": {
      "work-1": "img/residents/motion/cat-02/work-1.b4149bdd39e9.webp",
      "work-2": "img/residents/motion/cat-02/work-2.86d036ab8607.webp",
      "work-3": "img/residents/motion/cat-02/work-3.7fdac39ec3a6.webp",
      "walk-1": "img/residents/motion/cat-02/walk-1.80ce18494f7b.webp",
      "walk-2": "img/residents/motion/cat-02/walk-2.0869bbe224b4.webp",
      "front-1": "img/residents/motion/cat-02/front-1.5d0e8a7b1455.webp",
      "front-2": "img/residents/motion/cat-02/front-2.a69f0d216fd1.webp",
      "back-1": "img/residents/motion/cat-02/back-1.aa4f04370761.webp",
      "back-2": "img/residents/motion/cat-02/back-2.db2b351fd204.webp"
    },
    "2": {
      "work-1": "img/residents/motion/cat-03/work-1.44c18b6cc798.webp",
      "work-2": "img/residents/motion/cat-03/work-2.3a4fe8dcde06.webp",
      "work-3": "img/residents/motion/cat-03/work-3.73b060c15e4f.webp",
      "walk-1": "img/residents/motion/cat-03/walk-1.b2bb913253f7.webp",
      "walk-2": "img/residents/motion/cat-03/walk-2.0ab3e4cc3757.webp",
      "front-1": "img/residents/motion/cat-03/front-1.556739c7a8c1.webp",
      "front-2": "img/residents/motion/cat-03/front-2.ab17b13c7322.webp",
      "back-1": "img/residents/motion/cat-03/back-1.3ae38776ef25.webp",
      "back-2": "img/residents/motion/cat-03/back-2.1f331330bae5.webp"
    },
    "3": {
      "work-1": "img/residents/motion/cat-04/work-1.b6b54d11994d.webp",
      "work-2": "img/residents/motion/cat-04/work-2.0448006f20ca.webp",
      "work-3": "img/residents/motion/cat-04/work-3.8f845f19bbb1.webp",
      "walk-1": "img/residents/motion/cat-04/walk-1.49b0a462321c.webp",
      "walk-2": "img/residents/motion/cat-04/walk-2.833bb6f5e689.webp",
      "front-1": "img/residents/motion/cat-04/front-1.3d1f30877593.webp",
      "front-2": "img/residents/motion/cat-04/front-2.7547fdb1b2fd.webp",
      "back-1": "img/residents/motion/cat-04/back-1.04d82fbd6030.webp",
      "back-2": "img/residents/motion/cat-04/back-2.875454470f1e.webp"
    },
    "4": {
      "work-1": "img/residents/motion/cat-05/work-1.65c1c7d77e16.webp",
      "work-2": "img/residents/motion/cat-05/work-2.67991f512f04.webp",
      "work-3": "img/residents/motion/cat-05/work-3.96f3ad088663.webp",
      "walk-1": "img/residents/motion/cat-05/walk-1.a9cf7d146897.webp",
      "walk-2": "img/residents/motion/cat-05/walk-2.e9971a779a7b.webp",
      "front-1": "img/residents/motion/cat-05/front-1.cbe7f4574b71.webp",
      "front-2": "img/residents/motion/cat-05/front-2.2bee9debf7aa.webp",
      "back-1": "img/residents/motion/cat-05/back-1.7fa7670162bc.webp",
      "back-2": "img/residents/motion/cat-05/back-2.3e20d4770016.webp"
    },
    "5": {
      "work-1": "img/residents/motion/cat-06/work-1.7834c81fce8c.webp",
      "work-2": "img/residents/motion/cat-06/work-2.37b57c588753.webp",
      "work-3": "img/residents/motion/cat-06/work-3.f0d28e67efaa.webp",
      "walk-1": "img/residents/motion/cat-06/walk-1.fc3de4dd7329.webp",
      "walk-2": "img/residents/motion/cat-06/walk-2.3fa286bc5ab1.webp",
      "front-1": "img/residents/motion/cat-06/front-1.22a13ad2531e.webp",
      "front-2": "img/residents/motion/cat-06/front-2.662691dae165.webp",
      "back-1": "img/residents/motion/cat-06/back-1.885f1b44985e.webp",
      "back-2": "img/residents/motion/cat-06/back-2.e1e4294c22f2.webp"
    },
    "6": {
      "work-1": "img/residents/motion/cat-07/work-1.b701cf48fa5a.webp",
      "work-2": "img/residents/motion/cat-07/work-2.71be7c742294.webp",
      "work-3": "img/residents/motion/cat-07/work-3.7f1edec05fcb.webp",
      "walk-1": "img/residents/motion/cat-07/walk-1.6cd08b873df5.webp",
      "walk-2": "img/residents/motion/cat-07/walk-2.a17281560eee.webp",
      "front-1": "img/residents/motion/cat-07/front-1.e894df5382e4.webp",
      "front-2": "img/residents/motion/cat-07/front-2.03b058508538.webp",
      "back-1": "img/residents/motion/cat-07/back-1.25369ebcaa98.webp",
      "back-2": "img/residents/motion/cat-07/back-2.3fa284127385.webp"
    },
    "7": {
      "work-1": "img/residents/motion/cat-08/work-1.7e43659fe645.webp",
      "work-2": "img/residents/motion/cat-08/work-2.00c219e506d2.webp",
      "work-3": "img/residents/motion/cat-08/work-3.6a05d6c8fbb6.webp",
      "walk-1": "img/residents/motion/cat-08/walk-1.3ce64346cf26.webp",
      "walk-2": "img/residents/motion/cat-08/walk-2.31445ae8d0b0.webp",
      "front-1": "img/residents/motion/cat-08/front-1.49c0c517a9b3.webp",
      "front-2": "img/residents/motion/cat-08/front-2.b5de2a42a1f4.webp",
      "back-1": "img/residents/motion/cat-08/back-1.403afdbe8612.webp",
      "back-2": "img/residents/motion/cat-08/back-2.a6c3e57b1dc6.webp"
    },
    "8": {
      "work-1": "img/residents/motion/cat-09/work-1.7da48e22b3c6.webp",
      "work-2": "img/residents/motion/cat-09/work-2.bb8ee62dbc1e.webp",
      "work-3": "img/residents/motion/cat-09/work-3.ff9c8fa46f43.webp",
      "walk-1": "img/residents/motion/cat-09/walk-1.59f9c7eb6f00.webp",
      "walk-2": "img/residents/motion/cat-09/walk-2.aabd50c5d07e.webp",
      "front-1": "img/residents/motion/cat-09/front-1.854bb4b7b93c.webp",
      "front-2": "img/residents/motion/cat-09/front-2.df09196e8638.webp",
      "back-1": "img/residents/motion/cat-09/back-1.69d798c334c9.webp",
      "back-2": "img/residents/motion/cat-09/back-2.86de7ffe3fce.webp"
    },
    "9": {
      "work-1": "img/residents/motion/cat-10/work-1.0c59caca4cf4.webp",
      "work-2": "img/residents/motion/cat-10/work-2.b1f00faf5456.webp",
      "work-3": "img/residents/motion/cat-10/work-3.4ddbc74ed5c7.webp",
      "walk-1": "img/residents/motion/cat-10/walk-1.0c74faeb4fd9.webp",
      "walk-2": "img/residents/motion/cat-10/walk-2.82950a1f2405.webp",
      "front-1": "img/residents/motion/cat-10/front-1.c07389c75493.webp",
      "front-2": "img/residents/motion/cat-10/front-2.768f767047e4.webp",
      "back-1": "img/residents/motion/cat-10/back-1.f0dc21827c4a.webp",
      "back-2": "img/residents/motion/cat-10/back-2.535e7b70eb2d.webp"
    },
    "10": {
      "work-1": "img/residents/motion/cat-11/work-1.a2ffc962a8ef.webp",
      "work-2": "img/residents/motion/cat-11/work-2.13a42050ccb9.webp",
      "work-3": "img/residents/motion/cat-11/work-3.83f05302045d.webp",
      "walk-1": "img/residents/motion/cat-11/walk-1.5c08c4acc56d.webp",
      "walk-2": "img/residents/motion/cat-11/walk-2.dc9db92c818c.webp",
      "front-1": "img/residents/motion/cat-11/front-1.df067420c067.webp",
      "front-2": "img/residents/motion/cat-11/front-2.e7bf643923cd.webp",
      "back-1": "img/residents/motion/cat-11/back-1.ef3758b5111a.webp",
      "back-2": "img/residents/motion/cat-11/back-2.db44fa843545.webp"
    },
    "11": {
      "work-1": "img/residents/motion/cat-12/work-1.4c01631aa874.webp",
      "work-2": "img/residents/motion/cat-12/work-2.528251c0b2ce.webp",
      "work-3": "img/residents/motion/cat-12/work-3.4b26349848e0.webp",
      "walk-1": "img/residents/motion/cat-12/walk-1.d3f6322135d5.webp",
      "walk-2": "img/residents/motion/cat-12/walk-2.9e7fc3b3d125.webp",
      "front-1": "img/residents/motion/cat-12/front-1.6bcd30144282.webp",
      "front-2": "img/residents/motion/cat-12/front-2.3f2957f8ff36.webp",
      "back-1": "img/residents/motion/cat-12/back-1.c1f59e26a9af.webp",
      "back-2": "img/residents/motion/cat-12/back-2.5d14b6fad177.webp"
    },
    "12": {
      "work-1": "img/residents/motion/cat-13/work-1.f2b720a77af6.webp",
      "work-2": "img/residents/motion/cat-13/work-2.cf0a3f47f663.webp",
      "work-3": "img/residents/motion/cat-13/work-3.4151e9992d79.webp",
      "walk-1": "img/residents/motion/cat-13/walk-1.16b2795342e7.webp",
      "walk-2": "img/residents/motion/cat-13/walk-2.83217cc91d7f.webp",
      "front-1": "img/residents/motion/cat-13/front-1.09e481338dc0.webp",
      "front-2": "img/residents/motion/cat-13/front-2.03ebb1fae60b.webp",
      "back-1": "img/residents/motion/cat-13/back-1.592fb400324c.webp",
      "back-2": "img/residents/motion/cat-13/back-2.b82b28db6dda.webp"
    },
    "13": {
      "work-1": "img/residents/motion/cat-14/work-1.d70e6e3856b2.webp",
      "work-2": "img/residents/motion/cat-14/work-2.5d333088fd2d.webp",
      "work-3": "img/residents/motion/cat-14/work-3.d2c17c8c857f.webp",
      "walk-1": "img/residents/motion/cat-14/walk-1.7471262b0a72.webp",
      "walk-2": "img/residents/motion/cat-14/walk-2.e8ab627f3075.webp",
      "front-1": "img/residents/motion/cat-14/front-1.3dfe01b8b838.webp",
      "front-2": "img/residents/motion/cat-14/front-2.ef248f6eb2d3.webp",
      "back-1": "img/residents/motion/cat-14/back-1.791cdc177a2e.webp",
      "back-2": "img/residents/motion/cat-14/back-2.c2481863a76a.webp"
    },
    "14": {
      "work-1": "img/residents/motion/cat-15/work-1.6a8512e10b71.webp",
      "work-2": "img/residents/motion/cat-15/work-2.90ab2e3ef9a5.webp",
      "work-3": "img/residents/motion/cat-15/work-3.098c61bac5d1.webp",
      "walk-1": "img/residents/motion/cat-15/walk-1.17714e449ab4.webp",
      "walk-2": "img/residents/motion/cat-15/walk-2.85a4ccb27812.webp",
      "front-1": "img/residents/motion/cat-15/front-1.d3ec7e25784d.webp",
      "front-2": "img/residents/motion/cat-15/front-2.784374db86a7.webp",
      "back-1": "img/residents/motion/cat-15/back-1.0ae93a2f98d0.webp",
      "back-2": "img/residents/motion/cat-15/back-2.895f92639725.webp"
    },
    "15": {
      "work-1": "img/residents/motion/cat-16/work-1.4e6f156bb8cb.webp",
      "work-2": "img/residents/motion/cat-16/work-2.23fc80593da9.webp",
      "work-3": "img/residents/motion/cat-16/work-3.da470e4a0916.webp",
      "walk-1": "img/residents/motion/cat-16/walk-1.5f74523ae263.webp",
      "walk-2": "img/residents/motion/cat-16/walk-2.44d7daac7177.webp",
      "front-1": "img/residents/motion/cat-16/front-1.345dc48c230f.webp",
      "front-2": "img/residents/motion/cat-16/front-2.32e5572f406e.webp",
      "back-1": "img/residents/motion/cat-16/back-1.ecd117bb23dc.webp",
      "back-2": "img/residents/motion/cat-16/back-2.787309324b5c.webp"
    },
    "16": {
      "work-1": "img/residents/motion/cat-17/work-1.5d6fc9b875a5.webp",
      "work-2": "img/residents/motion/cat-17/work-2.f13f0999d14b.webp",
      "work-3": "img/residents/motion/cat-17/work-3.09d435c08a9d.webp",
      "walk-1": "img/residents/motion/cat-17/walk-1.bb230efc70e8.webp",
      "walk-2": "img/residents/motion/cat-17/walk-2.489dbb7a5269.webp",
      "front-1": "img/residents/motion/cat-17/front-1.53df4ea42acd.webp",
      "front-2": "img/residents/motion/cat-17/front-2.f88aaf372043.webp",
      "back-1": "img/residents/motion/cat-17/back-1.9106bac1f8f7.webp",
      "back-2": "img/residents/motion/cat-17/back-2.501ed13d4a2d.webp"
    },
    "17": {
      "work-1": "img/residents/motion/cat-18/work-1.6757d4787fac.webp",
      "work-2": "img/residents/motion/cat-18/work-2.472e88c5d986.webp",
      "work-3": "img/residents/motion/cat-18/work-3.61efce945183.webp",
      "walk-1": "img/residents/motion/cat-18/walk-1.ad71edb76f46.webp",
      "walk-2": "img/residents/motion/cat-18/walk-2.2cc364f510fd.webp",
      "front-1": "img/residents/motion/cat-18/front-1.c76ec0cf44e1.webp",
      "front-2": "img/residents/motion/cat-18/front-2.1f930c93afa0.webp",
      "back-1": "img/residents/motion/cat-18/back-1.53b9cec95b5a.webp",
      "back-2": "img/residents/motion/cat-18/back-2.77c00dd5d4cc.webp"
    },
    "18": {
      "work-1": "img/residents/motion/cat-19/work-1.053802f4f912.webp",
      "work-2": "img/residents/motion/cat-19/work-2.42f3d79a997c.webp",
      "work-3": "img/residents/motion/cat-19/work-3.56e5bf248c17.webp",
      "walk-1": "img/residents/motion/cat-19/walk-1.cf9f354ef2ee.webp",
      "walk-2": "img/residents/motion/cat-19/walk-2.8ce8c15ad4ae.webp",
      "front-1": "img/residents/motion/cat-19/front-1.c81ed85a92ac.webp",
      "front-2": "img/residents/motion/cat-19/front-2.4e9b3e12a2a8.webp",
      "back-1": "img/residents/motion/cat-19/back-1.117f2e40838b.webp",
      "back-2": "img/residents/motion/cat-19/back-2.2df502b367ed.webp"
    },
    "19": {
      "work-1": "img/residents/motion/cat-20/work-1.a757918972e6.webp",
      "work-2": "img/residents/motion/cat-20/work-2.b5012235b232.webp",
      "work-3": "img/residents/motion/cat-20/work-3.b0d2731f7b4f.webp",
      "walk-1": "img/residents/motion/cat-20/walk-1.e4c2c2cb8368.webp",
      "walk-2": "img/residents/motion/cat-20/walk-2.fb36acf5cbaa.webp",
      "front-1": "img/residents/motion/cat-20/front-1.b324f7e9117b.webp",
      "front-2": "img/residents/motion/cat-20/front-2.261113da7eae.webp",
      "back-1": "img/residents/motion/cat-20/back-1.f6fc20e219e3.webp",
      "back-2": "img/residents/motion/cat-20/back-2.2382feebbc10.webp"
    },
    "20": {
      "work-1": "img/residents/motion/cat-21/work-1.72bad843bb8e.webp",
      "work-2": "img/residents/motion/cat-21/work-2.7642a755afbc.webp",
      "work-3": "img/residents/motion/cat-21/work-3.174e35831c11.webp",
      "walk-1": "img/residents/motion/cat-21/walk-1.0d089c0649ef.webp",
      "walk-2": "img/residents/motion/cat-21/walk-2.acb4f36f4929.webp",
      "front-1": "img/residents/motion/cat-21/front-1.2688e4419021.webp",
      "front-2": "img/residents/motion/cat-21/front-2.c8ca041a37fa.webp",
      "back-1": "img/residents/motion/cat-21/back-1.3d7bdd1d6e0a.webp",
      "back-2": "img/residents/motion/cat-21/back-2.383832ed8992.webp"
    },
    "21": {
      "work-1": "img/residents/motion/cat-22/work-1.9dfe61451f74.webp",
      "work-2": "img/residents/motion/cat-22/work-2.0146462485c5.webp",
      "work-3": "img/residents/motion/cat-22/work-3.76d9375a0b5a.webp",
      "walk-1": "img/residents/motion/cat-22/walk-1.4be5dd388875.webp",
      "walk-2": "img/residents/motion/cat-22/walk-2.27053a14a1e7.webp",
      "front-1": "img/residents/motion/cat-22/front-1.f62052c68cfb.webp",
      "front-2": "img/residents/motion/cat-22/front-2.8cec01e9648c.webp",
      "back-1": "img/residents/motion/cat-22/back-1.1342e89104cb.webp",
      "back-2": "img/residents/motion/cat-22/back-2.da03981e9e3e.webp"
    },
    "22": {
      "work-1": "img/residents/motion/cat-23/work-1.37e05efad032.webp",
      "work-2": "img/residents/motion/cat-23/work-2.bf25c303e72f.webp",
      "work-3": "img/residents/motion/cat-23/work-3.31e0ead1f723.webp",
      "walk-1": "img/residents/motion/cat-23/walk-1.e0b3786a4067.webp",
      "walk-2": "img/residents/motion/cat-23/walk-2.eacbdbb0db2c.webp",
      "front-1": "img/residents/motion/cat-23/front-1.358c343dff60.webp",
      "front-2": "img/residents/motion/cat-23/front-2.9bf230a5aea5.webp",
      "back-1": "img/residents/motion/cat-23/back-1.38d3279359fc.webp",
      "back-2": "img/residents/motion/cat-23/back-2.23e0ce997075.webp"
    },
    "23": {
      "work-1": "img/residents/motion/cat-24/work-1.13f6d1acd26b.webp",
      "work-2": "img/residents/motion/cat-24/work-2.0485b75910ff.webp",
      "work-3": "img/residents/motion/cat-24/work-3.bb5180acc5f5.webp",
      "walk-1": "img/residents/motion/cat-24/walk-1.a2f7d39c1ea5.webp",
      "walk-2": "img/residents/motion/cat-24/walk-2.7f1d37285661.webp",
      "front-1": "img/residents/motion/cat-24/front-1.0c08e96553f0.webp",
      "front-2": "img/residents/motion/cat-24/front-2.2010d6c8ddcc.webp",
      "back-1": "img/residents/motion/cat-24/back-1.ef0a8db0069e.webp",
      "back-2": "img/residents/motion/cat-24/back-2.1349c0c87805.webp"
    },
    "24": {
      "work-1": "img/residents/motion/cat-25/work-1.99c2f5e711bd.webp",
      "work-2": "img/residents/motion/cat-25/work-2.5dca62f896c9.webp",
      "work-3": "img/residents/motion/cat-25/work-3.90694ccc7d20.webp",
      "walk-1": "img/residents/motion/cat-25/walk-1.fef45828510a.webp",
      "walk-2": "img/residents/motion/cat-25/walk-2.88d0e7b7acd0.webp",
      "front-1": "img/residents/motion/cat-25/front-1.d6a1aa7bf143.webp",
      "front-2": "img/residents/motion/cat-25/front-2.6a9dec6c548f.webp",
      "back-1": "img/residents/motion/cat-25/back-1.fafd38378332.webp",
      "back-2": "img/residents/motion/cat-25/back-2.dcdfed538b0a.webp"
    },
    "25": {
      "work-1": "img/residents/motion/cat-26/work-1.90708afb2f61.webp",
      "work-2": "img/residents/motion/cat-26/work-2.0930339024cc.webp",
      "work-3": "img/residents/motion/cat-26/work-3.ad55b138b009.webp",
      "walk-1": "img/residents/motion/cat-26/walk-1.bc3ea584074d.webp",
      "walk-2": "img/residents/motion/cat-26/walk-2.9c0059714cf2.webp",
      "front-1": "img/residents/motion/cat-26/front-1.46283b780be0.webp",
      "front-2": "img/residents/motion/cat-26/front-2.d410d24293fd.webp",
      "back-1": "img/residents/motion/cat-26/back-1.19733e10b2b6.webp",
      "back-2": "img/residents/motion/cat-26/back-2.8b5fa0677f3b.webp"
    },
    "26": {
      "work-1": "img/residents/motion/cat-27/work-1.dc555628b266.webp",
      "work-2": "img/residents/motion/cat-27/work-2.02f710d6cc5d.webp",
      "work-3": "img/residents/motion/cat-27/work-3.501dacc5e205.webp",
      "walk-1": "img/residents/motion/cat-27/walk-1.6ed79744c8b0.webp",
      "walk-2": "img/residents/motion/cat-27/walk-2.a3dc832a8745.webp",
      "front-1": "img/residents/motion/cat-27/front-1.dac27fcbc9c3.webp",
      "front-2": "img/residents/motion/cat-27/front-2.7c5f377a7978.webp",
      "back-1": "img/residents/motion/cat-27/back-1.3b9746086faa.webp",
      "back-2": "img/residents/motion/cat-27/back-2.b9ecef05929d.webp"
    },
    "27": {
      "work-1": "img/residents/motion/cat-28/work-1.2fce6cdabbd1.webp",
      "work-2": "img/residents/motion/cat-28/work-2.b32969de0882.webp",
      "work-3": "img/residents/motion/cat-28/work-3.de43d37effaf.webp",
      "walk-1": "img/residents/motion/cat-28/walk-1.9bf07b82c5da.webp",
      "walk-2": "img/residents/motion/cat-28/walk-2.31657b47eddc.webp",
      "front-1": "img/residents/motion/cat-28/front-1.e9c711d6a4d6.webp",
      "front-2": "img/residents/motion/cat-28/front-2.b79c4795bb73.webp",
      "back-1": "img/residents/motion/cat-28/back-1.a344c3d4fe6c.webp",
      "back-2": "img/residents/motion/cat-28/back-2.8140a96b383a.webp"
    },
    "28": {
      "work-1": "img/residents/motion/cat-29/work-1.21d06778941a.webp",
      "work-2": "img/residents/motion/cat-29/work-2.157cfaa8f8a2.webp",
      "work-3": "img/residents/motion/cat-29/work-3.9dc8e4736ff7.webp",
      "walk-1": "img/residents/motion/cat-29/walk-1.91b91b9b99b5.webp",
      "walk-2": "img/residents/motion/cat-29/walk-2.d3601bb86298.webp",
      "front-1": "img/residents/motion/cat-29/front-1.e8644f08b874.webp",
      "front-2": "img/residents/motion/cat-29/front-2.93fc3386bbd2.webp",
      "back-1": "img/residents/motion/cat-29/back-1.1e902c44a83d.webp",
      "back-2": "img/residents/motion/cat-29/back-2.e69460846b81.webp"
    },
    "29": {
      "work-1": "img/residents/motion/cat-30/work-1.79ea1fb686b7.webp",
      "work-2": "img/residents/motion/cat-30/work-2.0accc824acd9.webp",
      "work-3": "img/residents/motion/cat-30/work-3.3aa6dc542417.webp",
      "walk-1": "img/residents/motion/cat-30/walk-1.1dbd90db8fd7.webp",
      "walk-2": "img/residents/motion/cat-30/walk-2.1320db39a3de.webp",
      "front-1": "img/residents/motion/cat-30/front-1.2b51c742d059.webp",
      "front-2": "img/residents/motion/cat-30/front-2.aff27c772fdf.webp",
      "back-1": "img/residents/motion/cat-30/back-1.c8f8e8b7db43.webp",
      "back-2": "img/residents/motion/cat-30/back-2.3023bcc8f844.webp"
    },
    "30": {
      "work-1": "img/residents/motion/cat-31/work-1.07a87609ba9b.webp",
      "work-2": "img/residents/motion/cat-31/work-2.8f42eb76f5c4.webp",
      "work-3": "img/residents/motion/cat-31/work-3.400f77e08fd5.webp",
      "walk-1": "img/residents/motion/cat-31/walk-1.c5c60a4495ad.webp",
      "walk-2": "img/residents/motion/cat-31/walk-2.740e35162973.webp",
      "front-1": "img/residents/motion/cat-31/front-1.f0779875a082.webp",
      "front-2": "img/residents/motion/cat-31/front-2.46a1e879347d.webp",
      "back-1": "img/residents/motion/cat-31/back-1.37d25e12a338.webp",
      "back-2": "img/residents/motion/cat-31/back-2.b2bb1c0d22e8.webp"
    },
    "31": {
      "work-1": "img/residents/motion/cat-32/work-1.92c192830c6c.webp",
      "work-2": "img/residents/motion/cat-32/work-2.07414071a294.webp",
      "work-3": "img/residents/motion/cat-32/work-3.8c92e839d1be.webp",
      "walk-1": "img/residents/motion/cat-32/walk-1.959f73b0ab55.webp",
      "walk-2": "img/residents/motion/cat-32/walk-2.04fdfbd53b43.webp",
      "front-1": "img/residents/motion/cat-32/front-1.5d3db65e2e08.webp",
      "front-2": "img/residents/motion/cat-32/front-2.d2aa17d49557.webp",
      "back-1": "img/residents/motion/cat-32/back-1.8126890d0be6.webp",
      "back-2": "img/residents/motion/cat-32/back-2.e3dc2384ddb7.webp"
    },
    "32": {
      "work-1": "img/residents/motion/cat-33/work-1.52d1f6996e61.webp",
      "work-2": "img/residents/motion/cat-33/work-2.d90624e37405.webp",
      "work-3": "img/residents/motion/cat-33/work-3.fdba62577b59.webp",
      "walk-1": "img/residents/motion/cat-33/walk-1.5bc898dfa10d.webp",
      "walk-2": "img/residents/motion/cat-33/walk-2.4438f856bcf8.webp",
      "front-1": "img/residents/motion/cat-33/front-1.f5b0320e3fcd.webp",
      "front-2": "img/residents/motion/cat-33/front-2.d34879537e00.webp",
      "back-1": "img/residents/motion/cat-33/back-1.d8c28314588f.webp",
      "back-2": "img/residents/motion/cat-33/back-2.bfb02896208b.webp"
    },
    "33": {
      "work-1": "img/residents/motion/cat-34/work-1.7b40ebef0793.webp",
      "work-2": "img/residents/motion/cat-34/work-2.518169709ceb.webp",
      "work-3": "img/residents/motion/cat-34/work-3.903ed7ddfef6.webp",
      "walk-1": "img/residents/motion/cat-34/walk-1.20a1d9e4570a.webp",
      "walk-2": "img/residents/motion/cat-34/walk-2.c08122ba21af.webp",
      "front-1": "img/residents/motion/cat-34/front-1.394fc592fd78.webp",
      "front-2": "img/residents/motion/cat-34/front-2.215c4ada1681.webp",
      "back-1": "img/residents/motion/cat-34/back-1.172925c0e44e.webp",
      "back-2": "img/residents/motion/cat-34/back-2.971916c2c3c4.webp"
    },
    "34": {
      "work-1": "img/residents/motion/cat-35/work-1.2260176c0453.webp",
      "work-2": "img/residents/motion/cat-35/work-2.d75028a64677.webp",
      "work-3": "img/residents/motion/cat-35/work-3.8c68e07afd63.webp",
      "walk-1": "img/residents/motion/cat-35/walk-1.d4022f6b4160.webp",
      "walk-2": "img/residents/motion/cat-35/walk-2.77f1cb8dca93.webp",
      "front-1": "img/residents/motion/cat-35/front-1.68dc375dec76.webp",
      "front-2": "img/residents/motion/cat-35/front-2.b0985105c285.webp",
      "back-1": "img/residents/motion/cat-35/back-1.b42316043660.webp",
      "back-2": "img/residents/motion/cat-35/back-2.51192b79a952.webp"
    },
    "35": {
      "work-1": "img/residents/motion/cat-36/work-1.a43504829692.webp",
      "work-2": "img/residents/motion/cat-36/work-2.1b0328b40a2b.webp",
      "work-3": "img/residents/motion/cat-36/work-3.bad0e74015b6.webp",
      "walk-1": "img/residents/motion/cat-36/walk-1.7318d8627462.webp",
      "walk-2": "img/residents/motion/cat-36/walk-2.6eb564b0d23b.webp",
      "front-1": "img/residents/motion/cat-36/front-1.4722d5aaa694.webp",
      "front-2": "img/residents/motion/cat-36/front-2.6a626de204a1.webp",
      "back-1": "img/residents/motion/cat-36/back-1.3d68cd471aba.webp",
      "back-2": "img/residents/motion/cat-36/back-2.1b8a448ad2f3.webp"
    },
    "36": {
      "work-1": "img/residents/motion/cat-37/work-1.c99927f3188d.webp",
      "work-2": "img/residents/motion/cat-37/work-2.dcf67996a2f2.webp",
      "work-3": "img/residents/motion/cat-37/work-3.f7c9ff855232.webp",
      "walk-1": "img/residents/motion/cat-37/walk-1.3219c4dfd5bf.webp",
      "walk-2": "img/residents/motion/cat-37/walk-2.f7880a75c8dc.webp",
      "front-1": "img/residents/motion/cat-37/front-1.4460d7d1ef7d.webp",
      "front-2": "img/residents/motion/cat-37/front-2.800116c8ae43.webp",
      "back-1": "img/residents/motion/cat-37/back-1.c176ee134751.webp",
      "back-2": "img/residents/motion/cat-37/back-2.2c8cf2bbd1ee.webp"
    },
    "37": {
      "work-1": "img/residents/motion/cat-38/work-1.1612072758af.webp",
      "work-2": "img/residents/motion/cat-38/work-2.fe3156bcd445.webp",
      "work-3": "img/residents/motion/cat-38/work-3.753fc7fe4f6f.webp",
      "walk-1": "img/residents/motion/cat-38/walk-1.8c44fcb9ba39.webp",
      "walk-2": "img/residents/motion/cat-38/walk-2.5f046642107c.webp",
      "front-1": "img/residents/motion/cat-38/front-1.167e78c4b28c.webp",
      "front-2": "img/residents/motion/cat-38/front-2.9d77a10d31be.webp",
      "back-1": "img/residents/motion/cat-38/back-1.bc880958edd6.webp",
      "back-2": "img/residents/motion/cat-38/back-2.4cdc2eeb58c2.webp"
    },
    "38": {
      "work-1": "img/residents/motion/cat-39/work-1.f9f547b52b74.webp",
      "work-2": "img/residents/motion/cat-39/work-2.e29bc327865c.webp",
      "work-3": "img/residents/motion/cat-39/work-3.97cf0b718a7e.webp",
      "walk-1": "img/residents/motion/cat-39/walk-1.f7a6160b0c29.webp",
      "walk-2": "img/residents/motion/cat-39/walk-2.2dd2cdf0911a.webp",
      "front-1": "img/residents/motion/cat-39/front-1.53df54186946.webp",
      "front-2": "img/residents/motion/cat-39/front-2.9d9731809972.webp",
      "back-1": "img/residents/motion/cat-39/back-1.5dec956a7b7c.webp",
      "back-2": "img/residents/motion/cat-39/back-2.8a99354999aa.webp"
    },
    "39": {
      "work-1": "img/residents/motion/cat-40/work-1.8163ac69655b.webp",
      "work-2": "img/residents/motion/cat-40/work-2.dbb16441f141.webp",
      "work-3": "img/residents/motion/cat-40/work-3.bd623f87f66b.webp",
      "walk-1": "img/residents/motion/cat-40/walk-1.8edaf559d821.webp",
      "walk-2": "img/residents/motion/cat-40/walk-2.054d5844239c.webp",
      "front-1": "img/residents/motion/cat-40/front-1.478a66a866e4.webp",
      "front-2": "img/residents/motion/cat-40/front-2.4aa197f6e2f2.webp",
      "back-1": "img/residents/motion/cat-40/back-1.6789de528b8f.webp",
      "back-2": "img/residents/motion/cat-40/back-2.12816c06eb9a.webp"
    }
  },
  "dog": {
    "0": {
      "work-1": "img/residents/motion/dog-01/work-1.95210ee8ecb7.webp",
      "work-2": "img/residents/motion/dog-01/work-2.6e115c8c2354.webp",
      "work-3": "img/residents/motion/dog-01/work-3.757d776e53e8.webp",
      "walk-1": "img/residents/motion/dog-01/walk-1.951c2d8bb0fb.webp",
      "walk-2": "img/residents/motion/dog-01/walk-2.92b1679a4ddc.webp",
      "front-1": "img/residents/motion/dog-01/front-1.724fea66e667.webp",
      "front-2": "img/residents/motion/dog-01/front-2.2f56136e5a95.webp",
      "back-1": "img/residents/motion/dog-01/back-1.142ecc9356eb.webp",
      "back-2": "img/residents/motion/dog-01/back-2.eef3cfa6b9d1.webp"
    },
    "1": {
      "work-1": "img/residents/motion/dog-02/work-1.b80a84bedd1d.webp",
      "work-2": "img/residents/motion/dog-02/work-2.7523cd2511f0.webp",
      "work-3": "img/residents/motion/dog-02/work-3.91b2b2307951.webp",
      "walk-1": "img/residents/motion/dog-02/walk-1.46c16812a618.webp",
      "walk-2": "img/residents/motion/dog-02/walk-2.cee319dab8ba.webp",
      "front-1": "img/residents/motion/dog-02/front-1.f8e45d454930.webp",
      "front-2": "img/residents/motion/dog-02/front-2.c539a26fd1ee.webp",
      "back-1": "img/residents/motion/dog-02/back-1.6b978e4e201c.webp",
      "back-2": "img/residents/motion/dog-02/back-2.8a74e7e8c6c5.webp"
    },
    "2": {
      "work-1": "img/residents/motion/dog-03/work-1.0c90b1a5bcf6.webp",
      "work-2": "img/residents/motion/dog-03/work-2.be622796303a.webp",
      "work-3": "img/residents/motion/dog-03/work-3.beda95a3ad09.webp",
      "walk-1": "img/residents/motion/dog-03/walk-1.6f3750f0c795.webp",
      "walk-2": "img/residents/motion/dog-03/walk-2.ad133ccca9a6.webp",
      "front-1": "img/residents/motion/dog-03/front-1.9b9ca35d1126.webp",
      "front-2": "img/residents/motion/dog-03/front-2.e57449919342.webp",
      "back-1": "img/residents/motion/dog-03/back-1.ab6df918745e.webp",
      "back-2": "img/residents/motion/dog-03/back-2.1ab2fa1dcba0.webp"
    },
    "3": {
      "work-1": "img/residents/motion/dog-04/work-1.1650594763f3.webp",
      "work-2": "img/residents/motion/dog-04/work-2.eabbf4c88b82.webp",
      "work-3": "img/residents/motion/dog-04/work-3.c59da0a40bc9.webp",
      "walk-1": "img/residents/motion/dog-04/walk-1.459778d05be1.webp",
      "walk-2": "img/residents/motion/dog-04/walk-2.6cb9ffd32aee.webp",
      "front-1": "img/residents/motion/dog-04/front-1.dbfae78273d2.webp",
      "front-2": "img/residents/motion/dog-04/front-2.4fef26fba9fc.webp",
      "back-1": "img/residents/motion/dog-04/back-1.eb1466eb9d95.webp",
      "back-2": "img/residents/motion/dog-04/back-2.d2554e99b5d6.webp"
    },
    "4": {
      "work-1": "img/residents/motion/dog-05/work-1.ccfdf8ea8f5d.webp",
      "work-2": "img/residents/motion/dog-05/work-2.b3ee68ba345a.webp",
      "work-3": "img/residents/motion/dog-05/work-3.a2cf7b17e3a6.webp",
      "walk-1": "img/residents/motion/dog-05/walk-1.3b38ccea1112.webp",
      "walk-2": "img/residents/motion/dog-05/walk-2.bc7a664ac590.webp",
      "front-1": "img/residents/motion/dog-05/front-1.2565e4693612.webp",
      "front-2": "img/residents/motion/dog-05/front-2.090bb5491aa0.webp",
      "back-1": "img/residents/motion/dog-05/back-1.0672ad958766.webp",
      "back-2": "img/residents/motion/dog-05/back-2.e92f3ee610c8.webp"
    },
    "5": {
      "work-1": "img/residents/motion/dog-06/work-1.6bf442a10868.webp",
      "work-2": "img/residents/motion/dog-06/work-2.63a7eec2a819.webp",
      "work-3": "img/residents/motion/dog-06/work-3.aeb74eff4d4a.webp",
      "walk-1": "img/residents/motion/dog-06/walk-1.610ddfac13b4.webp",
      "walk-2": "img/residents/motion/dog-06/walk-2.ab50c3c6edeb.webp",
      "front-1": "img/residents/motion/dog-06/front-1.66312f944266.webp",
      "front-2": "img/residents/motion/dog-06/front-2.daae527a204f.webp",
      "back-1": "img/residents/motion/dog-06/back-1.de5ddccdae64.webp",
      "back-2": "img/residents/motion/dog-06/back-2.8988ed9a9d76.webp"
    },
    "6": {
      "work-1": "img/residents/motion/dog-07/work-1.dec5ae17c261.webp",
      "work-2": "img/residents/motion/dog-07/work-2.7ef4c0024a75.webp",
      "work-3": "img/residents/motion/dog-07/work-3.d94d69df0036.webp",
      "walk-1": "img/residents/motion/dog-07/walk-1.791ca06fd1c6.webp",
      "walk-2": "img/residents/motion/dog-07/walk-2.9be92e584d9d.webp",
      "front-1": "img/residents/motion/dog-07/front-1.4bb1aee8de4c.webp",
      "front-2": "img/residents/motion/dog-07/front-2.708068ef7b69.webp",
      "back-1": "img/residents/motion/dog-07/back-1.f716300d2cb1.webp",
      "back-2": "img/residents/motion/dog-07/back-2.5e7afbe920db.webp"
    },
    "7": {
      "work-1": "img/residents/motion/dog-08/work-1.464e4bd79049.webp",
      "work-2": "img/residents/motion/dog-08/work-2.2795f544c95a.webp",
      "work-3": "img/residents/motion/dog-08/work-3.3f70abad6952.webp",
      "walk-1": "img/residents/motion/dog-08/walk-1.b5a52205ec73.webp",
      "walk-2": "img/residents/motion/dog-08/walk-2.1a519e0a190f.webp",
      "front-1": "img/residents/motion/dog-08/front-1.ce17db44d60f.webp",
      "front-2": "img/residents/motion/dog-08/front-2.b6d3333f5c1b.webp",
      "back-1": "img/residents/motion/dog-08/back-1.0e35e325eb6d.webp",
      "back-2": "img/residents/motion/dog-08/back-2.3f1c88116614.webp"
    },
    "8": {
      "work-1": "img/residents/motion/dog-09/work-1.0657235fdac9.webp",
      "work-2": "img/residents/motion/dog-09/work-2.d106f6928cfd.webp",
      "work-3": "img/residents/motion/dog-09/work-3.7c64002841ac.webp",
      "walk-1": "img/residents/motion/dog-09/walk-1.fa2bcaee9dcf.webp",
      "walk-2": "img/residents/motion/dog-09/walk-2.67327cd2aaa5.webp",
      "front-1": "img/residents/motion/dog-09/front-1.4710d6f088ac.webp",
      "front-2": "img/residents/motion/dog-09/front-2.fe916905e589.webp",
      "back-1": "img/residents/motion/dog-09/back-1.f78142f5da6e.webp",
      "back-2": "img/residents/motion/dog-09/back-2.6aef985cab7c.webp"
    },
    "9": {
      "work-1": "img/residents/motion/dog-10/work-1.3a2fd7783d5f.webp",
      "work-2": "img/residents/motion/dog-10/work-2.f6ec55900e68.webp",
      "work-3": "img/residents/motion/dog-10/work-3.d7898af31b1e.webp",
      "walk-1": "img/residents/motion/dog-10/walk-1.f7fd11f4546b.webp",
      "walk-2": "img/residents/motion/dog-10/walk-2.bae4231dc33e.webp",
      "front-1": "img/residents/motion/dog-10/front-1.1cbf2e8f951d.webp",
      "front-2": "img/residents/motion/dog-10/front-2.c45f9eafee14.webp",
      "back-1": "img/residents/motion/dog-10/back-1.cbcfb76978ae.webp",
      "back-2": "img/residents/motion/dog-10/back-2.77e66f7ebd9a.webp"
    },
    "10": {
      "work-1": "img/residents/motion/dog-11/work-1.730c25392bd3.webp",
      "work-2": "img/residents/motion/dog-11/work-2.e2c90e286ee3.webp",
      "work-3": "img/residents/motion/dog-11/work-3.76737d4d8fe6.webp",
      "walk-1": "img/residents/motion/dog-11/walk-1.d17eb15487a1.webp",
      "walk-2": "img/residents/motion/dog-11/walk-2.25f9d306b65b.webp",
      "front-1": "img/residents/motion/dog-11/front-1.639cac7da57a.webp",
      "front-2": "img/residents/motion/dog-11/front-2.ab70999ff81d.webp",
      "back-1": "img/residents/motion/dog-11/back-1.f715b7118a2f.webp",
      "back-2": "img/residents/motion/dog-11/back-2.624a5d89f738.webp"
    },
    "11": {
      "work-1": "img/residents/motion/dog-12/work-1.4b3cd3749ecf.webp",
      "work-2": "img/residents/motion/dog-12/work-2.c583ad41e15a.webp",
      "work-3": "img/residents/motion/dog-12/work-3.9a324097c993.webp",
      "walk-1": "img/residents/motion/dog-12/walk-1.0375fbdaac58.webp",
      "walk-2": "img/residents/motion/dog-12/walk-2.94b26f6907cb.webp",
      "front-1": "img/residents/motion/dog-12/front-1.e7922dcf754e.webp",
      "front-2": "img/residents/motion/dog-12/front-2.16da59af7b86.webp",
      "back-1": "img/residents/motion/dog-12/back-1.8042312e0edd.webp",
      "back-2": "img/residents/motion/dog-12/back-2.3bd8dd9de420.webp"
    },
    "12": {
      "walk-1": "img/residents/motion/dog-13/walk-1.1cdd71906ffa.webp",
      "walk-2": "img/residents/motion/dog-13/walk-2.3dee7e7a119c.webp",
      "front-1": "img/residents/motion/dog-13/front-1.87b0ce1e7e81.webp",
      "front-2": "img/residents/motion/dog-13/front-2.bf951080e8c5.webp",
      "back-1": "img/residents/motion/dog-13/back-1.2baff98351de.webp",
      "back-2": "img/residents/motion/dog-13/back-2.79e1ea0cce9a.webp"
    },
    "13": {
      "work-1": "img/residents/motion/dog-14/work-1.67001f323b33.webp",
      "work-2": "img/residents/motion/dog-14/work-2.6ddeec4c8c54.webp",
      "work-3": "img/residents/motion/dog-14/work-3.7df22145a5f8.webp",
      "walk-1": "img/residents/motion/dog-14/walk-1.34106da5c4c5.webp",
      "walk-2": "img/residents/motion/dog-14/walk-2.04f31df9c059.webp",
      "front-1": "img/residents/motion/dog-14/front-1.b286dee3847a.webp",
      "front-2": "img/residents/motion/dog-14/front-2.26960b2a28c3.webp",
      "back-1": "img/residents/motion/dog-14/back-1.f62e3df26d05.webp",
      "back-2": "img/residents/motion/dog-14/back-2.4b6acfd600f8.webp"
    },
    "14": {
      "work-1": "img/residents/motion/dog-15/work-1.8e1c72cbd187.webp",
      "work-2": "img/residents/motion/dog-15/work-2.6ad83adb3655.webp",
      "work-3": "img/residents/motion/dog-15/work-3.ca9fd4ab1296.webp",
      "walk-1": "img/residents/motion/dog-15/walk-1.783ba7cbc63f.webp",
      "walk-2": "img/residents/motion/dog-15/walk-2.b07654df50df.webp",
      "front-1": "img/residents/motion/dog-15/front-1.c331ad38a062.webp",
      "front-2": "img/residents/motion/dog-15/front-2.ada6482d1188.webp",
      "back-1": "img/residents/motion/dog-15/back-1.f654a0f0f6e6.webp",
      "back-2": "img/residents/motion/dog-15/back-2.667955b63682.webp"
    },
    "15": {
      "work-1": "img/residents/motion/dog-16/work-1.08fcdd4cf9d7.webp",
      "work-2": "img/residents/motion/dog-16/work-2.64e5f641f36d.webp",
      "work-3": "img/residents/motion/dog-16/work-3.6cda7bfe0d0a.webp",
      "walk-1": "img/residents/motion/dog-16/walk-1.70da857d6602.webp",
      "walk-2": "img/residents/motion/dog-16/walk-2.64a11cbd1627.webp",
      "front-1": "img/residents/motion/dog-16/front-1.83dccba6d245.webp",
      "front-2": "img/residents/motion/dog-16/front-2.965a10e22248.webp",
      "back-1": "img/residents/motion/dog-16/back-1.6c86ce158c5a.webp",
      "back-2": "img/residents/motion/dog-16/back-2.e217db4bd0d1.webp"
    },
    "16": {
      "work-1": "img/residents/motion/dog-17/work-1.3f6774f0aa4a.webp",
      "work-2": "img/residents/motion/dog-17/work-2.1a29c43c1dd8.webp",
      "work-3": "img/residents/motion/dog-17/work-3.44d495c1ea53.webp",
      "walk-1": "img/residents/motion/dog-17/walk-1.464c6a10df99.webp",
      "walk-2": "img/residents/motion/dog-17/walk-2.f6f7085512fa.webp",
      "front-1": "img/residents/motion/dog-17/front-1.e975902a3994.webp",
      "front-2": "img/residents/motion/dog-17/front-2.571cd63b65ab.webp",
      "back-1": "img/residents/motion/dog-17/back-1.8208c26b5aa0.webp",
      "back-2": "img/residents/motion/dog-17/back-2.933fca424ce0.webp"
    },
    "17": {
      "work-1": "img/residents/motion/dog-18/work-1.deeb62a94281.webp",
      "work-2": "img/residents/motion/dog-18/work-2.e677f26d3378.webp",
      "work-3": "img/residents/motion/dog-18/work-3.afffa45f3510.webp",
      "walk-1": "img/residents/motion/dog-18/walk-1.ae46068bfe1e.webp",
      "walk-2": "img/residents/motion/dog-18/walk-2.5cd0e43dc30a.webp",
      "front-1": "img/residents/motion/dog-18/front-1.8b5e51461eb0.webp",
      "front-2": "img/residents/motion/dog-18/front-2.5b0fc4a76006.webp",
      "back-1": "img/residents/motion/dog-18/back-1.bbf27ce0230f.webp",
      "back-2": "img/residents/motion/dog-18/back-2.92f14da21c15.webp"
    },
    "18": {
      "work-1": "img/residents/motion/dog-19/work-1.a012f933f14c.webp",
      "work-2": "img/residents/motion/dog-19/work-2.b784c4157e35.webp",
      "work-3": "img/residents/motion/dog-19/work-3.beb2bfd50489.webp",
      "walk-1": "img/residents/motion/dog-19/walk-1.798b93681d1e.webp",
      "walk-2": "img/residents/motion/dog-19/walk-2.20b09141963d.webp",
      "front-1": "img/residents/motion/dog-19/front-1.77499a5268de.webp",
      "front-2": "img/residents/motion/dog-19/front-2.80a4dad5880a.webp",
      "back-1": "img/residents/motion/dog-19/back-1.ba5f94810f0b.webp",
      "back-2": "img/residents/motion/dog-19/back-2.dd7c73cf6ac0.webp"
    },
    "19": {
      "work-1": "img/residents/motion/dog-20/work-1.f3bcc8469b1e.webp",
      "work-2": "img/residents/motion/dog-20/work-2.84b671bea515.webp",
      "work-3": "img/residents/motion/dog-20/work-3.e3f842fcf133.webp",
      "walk-1": "img/residents/motion/dog-20/walk-1.0315fab866cf.webp",
      "walk-2": "img/residents/motion/dog-20/walk-2.16c5afe806b0.webp",
      "front-1": "img/residents/motion/dog-20/front-1.89443097266b.webp",
      "front-2": "img/residents/motion/dog-20/front-2.301db2eae6ed.webp",
      "back-1": "img/residents/motion/dog-20/back-1.504137483f66.webp",
      "back-2": "img/residents/motion/dog-20/back-2.a44654be7a33.webp"
    },
    "20": {
      "work-1": "img/residents/motion/dog-21/work-1.9ac13928c2d1.webp",
      "work-2": "img/residents/motion/dog-21/work-2.6b18e845685c.webp",
      "work-3": "img/residents/motion/dog-21/work-3.9a145a17f73a.webp",
      "walk-1": "img/residents/motion/dog-21/walk-1.1341069f0f1e.webp",
      "walk-2": "img/residents/motion/dog-21/walk-2.4726ba7064f4.webp",
      "front-1": "img/residents/motion/dog-21/front-1.dccbc1ea06fe.webp",
      "front-2": "img/residents/motion/dog-21/front-2.0ca869b7b1a3.webp",
      "back-1": "img/residents/motion/dog-21/back-1.ff1d37e5077c.webp",
      "back-2": "img/residents/motion/dog-21/back-2.832f3285b002.webp"
    },
    "21": {
      "work-1": "img/residents/motion/dog-22/work-1.4e7b172f4381.webp",
      "work-2": "img/residents/motion/dog-22/work-2.e0c95d7172b2.webp",
      "work-3": "img/residents/motion/dog-22/work-3.ecae59dfc504.webp",
      "walk-1": "img/residents/motion/dog-22/walk-1.7dfcf9ddf8fe.webp",
      "walk-2": "img/residents/motion/dog-22/walk-2.70b3f63866ee.webp",
      "front-1": "img/residents/motion/dog-22/front-1.0f21742ff209.webp",
      "front-2": "img/residents/motion/dog-22/front-2.8cae92bcf4d6.webp",
      "back-1": "img/residents/motion/dog-22/back-1.97884f582293.webp",
      "back-2": "img/residents/motion/dog-22/back-2.bccff053416e.webp"
    },
    "22": {
      "work-1": "img/residents/motion/dog-23/work-1.9a969201f1a1.webp",
      "work-2": "img/residents/motion/dog-23/work-2.fdf1038c05fa.webp",
      "work-3": "img/residents/motion/dog-23/work-3.17a404d3f5b1.webp",
      "walk-1": "img/residents/motion/dog-23/walk-1.2c7dec73c831.webp",
      "walk-2": "img/residents/motion/dog-23/walk-2.61906b7d4c8f.webp",
      "front-1": "img/residents/motion/dog-23/front-1.9b6cae3ae60b.webp",
      "front-2": "img/residents/motion/dog-23/front-2.c9df46c42b79.webp",
      "back-1": "img/residents/motion/dog-23/back-1.d2ae61526b8d.webp",
      "back-2": "img/residents/motion/dog-23/back-2.fc65d884bb9a.webp"
    },
    "23": {
      "work-1": "img/residents/motion/dog-24/work-1.10ea7dcc4645.webp",
      "work-2": "img/residents/motion/dog-24/work-2.3c3236b0f9ed.webp",
      "work-3": "img/residents/motion/dog-24/work-3.2efa18632857.webp",
      "walk-1": "img/residents/motion/dog-24/walk-1.e8e1ed5b2f5d.webp",
      "walk-2": "img/residents/motion/dog-24/walk-2.4ec4ee330ce5.webp",
      "front-1": "img/residents/motion/dog-24/front-1.036fbc624989.webp",
      "front-2": "img/residents/motion/dog-24/front-2.5f129bac6c1a.webp",
      "back-1": "img/residents/motion/dog-24/back-1.c6862d0fa198.webp",
      "back-2": "img/residents/motion/dog-24/back-2.bdc750bd897a.webp"
    },
    "24": {
      "work-1": "img/residents/motion/dog-25/work-1.ebe8b8ae04a2.webp",
      "work-2": "img/residents/motion/dog-25/work-2.83d989c8afdd.webp",
      "work-3": "img/residents/motion/dog-25/work-3.9c0b861b5565.webp",
      "walk-1": "img/residents/motion/dog-25/walk-1.5e6e9aedb6e9.webp",
      "walk-2": "img/residents/motion/dog-25/walk-2.ef2d8119989d.webp",
      "front-1": "img/residents/motion/dog-25/front-1.839ddfa604e7.webp",
      "front-2": "img/residents/motion/dog-25/front-2.63f0c5eb5130.webp",
      "back-1": "img/residents/motion/dog-25/back-1.0a66f4c7ff61.webp",
      "back-2": "img/residents/motion/dog-25/back-2.72d5561fa9d9.webp"
    },
    "25": {
      "work-1": "img/residents/motion/dog-26/work-1.2216d691a2f5.webp",
      "work-2": "img/residents/motion/dog-26/work-2.ec9d0896b5d5.webp",
      "work-3": "img/residents/motion/dog-26/work-3.5958e76492d2.webp",
      "walk-1": "img/residents/motion/dog-26/walk-1.13252000ca25.webp",
      "walk-2": "img/residents/motion/dog-26/walk-2.7dc109e40210.webp",
      "front-1": "img/residents/motion/dog-26/front-1.0f1acb9dcb28.webp",
      "front-2": "img/residents/motion/dog-26/front-2.c30bd5cdf94f.webp",
      "back-1": "img/residents/motion/dog-26/back-1.139b7e501d59.webp",
      "back-2": "img/residents/motion/dog-26/back-2.9801ce449ad4.webp"
    },
    "26": {
      "work-1": "img/residents/motion/dog-27/work-1.f5ea42f8f575.webp",
      "work-2": "img/residents/motion/dog-27/work-2.88f14cf9d768.webp",
      "work-3": "img/residents/motion/dog-27/work-3.3d2a1a126462.webp",
      "walk-1": "img/residents/motion/dog-27/walk-1.7fac0fddf169.webp",
      "walk-2": "img/residents/motion/dog-27/walk-2.f4b6f703bc7e.webp",
      "front-1": "img/residents/motion/dog-27/front-1.cda112164262.webp",
      "front-2": "img/residents/motion/dog-27/front-2.260b6e307445.webp",
      "back-1": "img/residents/motion/dog-27/back-1.900b0477300b.webp",
      "back-2": "img/residents/motion/dog-27/back-2.0504deca2a89.webp"
    },
    "27": {
      "work-1": "img/residents/motion/dog-28/work-1.6183bbb7b7c3.webp",
      "work-2": "img/residents/motion/dog-28/work-2.0b3364b8b076.webp",
      "work-3": "img/residents/motion/dog-28/work-3.d916e03b8d1a.webp",
      "walk-1": "img/residents/motion/dog-28/walk-1.2fd5ebba268a.webp",
      "walk-2": "img/residents/motion/dog-28/walk-2.ef1f513c9e2c.webp",
      "front-1": "img/residents/motion/dog-28/front-1.63d9d67d76bd.webp",
      "front-2": "img/residents/motion/dog-28/front-2.64e1483fc21e.webp",
      "back-1": "img/residents/motion/dog-28/back-1.b50844fdbef1.webp",
      "back-2": "img/residents/motion/dog-28/back-2.993d5bc5fb50.webp"
    },
    "28": {
      "work-1": "img/residents/motion/dog-29/work-1.a3213b3b11d7.webp",
      "work-2": "img/residents/motion/dog-29/work-2.f49fdbb04dd4.webp",
      "work-3": "img/residents/motion/dog-29/work-3.496c4de5fd76.webp",
      "walk-1": "img/residents/motion/dog-29/walk-1.0bc2c895926e.webp",
      "walk-2": "img/residents/motion/dog-29/walk-2.e01ea81eeb09.webp",
      "front-1": "img/residents/motion/dog-29/front-1.f35db02cb25f.webp",
      "front-2": "img/residents/motion/dog-29/front-2.a17013e210b4.webp",
      "back-1": "img/residents/motion/dog-29/back-1.08c4eafb5723.webp",
      "back-2": "img/residents/motion/dog-29/back-2.0943fc192b2e.webp"
    },
    "29": {
      "work-1": "img/residents/motion/dog-30/work-1.60ff44e28e1c.webp",
      "work-2": "img/residents/motion/dog-30/work-2.fc9d5aa91def.webp",
      "work-3": "img/residents/motion/dog-30/work-3.b991222e162b.webp",
      "walk-1": "img/residents/motion/dog-30/walk-1.a4605eeb6e0b.webp",
      "walk-2": "img/residents/motion/dog-30/walk-2.7f727e7ced36.webp",
      "front-1": "img/residents/motion/dog-30/front-1.8386d4e3eb9e.webp",
      "front-2": "img/residents/motion/dog-30/front-2.8c518895ecc6.webp",
      "back-1": "img/residents/motion/dog-30/back-1.a0665d379057.webp",
      "back-2": "img/residents/motion/dog-30/back-2.d0f6f8f0cb01.webp"
    },
    "30": {
      "work-1": "img/residents/motion/dog-31/work-1.845012f12155.webp",
      "work-2": "img/residents/motion/dog-31/work-2.2f65d454acad.webp",
      "work-3": "img/residents/motion/dog-31/work-3.03c19f13c17f.webp",
      "walk-1": "img/residents/motion/dog-31/walk-1.0b9c7925a9f5.webp",
      "walk-2": "img/residents/motion/dog-31/walk-2.44b3e52fa8f4.webp",
      "front-1": "img/residents/motion/dog-31/front-1.03d7f531f7fb.webp",
      "front-2": "img/residents/motion/dog-31/front-2.85f8d342a4dd.webp",
      "back-1": "img/residents/motion/dog-31/back-1.48e0ce3adfa2.webp",
      "back-2": "img/residents/motion/dog-31/back-2.171662cf62a4.webp"
    },
    "31": {
      "work-1": "img/residents/motion/dog-32/work-1.7fc9ba3ce45f.webp",
      "work-2": "img/residents/motion/dog-32/work-2.51c1782e4e07.webp",
      "work-3": "img/residents/motion/dog-32/work-3.5aa829003a18.webp",
      "walk-1": "img/residents/motion/dog-32/walk-1.482b96d5d871.webp",
      "walk-2": "img/residents/motion/dog-32/walk-2.05a456bf7a62.webp",
      "front-1": "img/residents/motion/dog-32/front-1.24d5fac68cda.webp",
      "front-2": "img/residents/motion/dog-32/front-2.325e078e33cb.webp",
      "back-1": "img/residents/motion/dog-32/back-1.4d6250f7a83a.webp",
      "back-2": "img/residents/motion/dog-32/back-2.de633f89157d.webp"
    },
    "32": {
      "work-1": "img/residents/motion/dog-33/work-1.6de2ae8dfa59.webp",
      "work-2": "img/residents/motion/dog-33/work-2.75f0ca23c8ec.webp",
      "work-3": "img/residents/motion/dog-33/work-3.3da029d775ae.webp",
      "walk-1": "img/residents/motion/dog-33/walk-1.e8c399d702fe.webp",
      "walk-2": "img/residents/motion/dog-33/walk-2.c53f6dba6381.webp",
      "front-1": "img/residents/motion/dog-33/front-1.faebdbe5254b.webp",
      "front-2": "img/residents/motion/dog-33/front-2.47d9acb9dae3.webp",
      "back-1": "img/residents/motion/dog-33/back-1.98da2195c6e7.webp",
      "back-2": "img/residents/motion/dog-33/back-2.d58002010b34.webp"
    },
    "33": {
      "work-1": "img/residents/motion/dog-34/work-1.a216ffab114f.webp",
      "work-2": "img/residents/motion/dog-34/work-2.549f245f0dfa.webp",
      "work-3": "img/residents/motion/dog-34/work-3.dd3eb33376fb.webp",
      "walk-1": "img/residents/motion/dog-34/walk-1.1167881acdfe.webp",
      "walk-2": "img/residents/motion/dog-34/walk-2.35c934b53a0c.webp",
      "front-1": "img/residents/motion/dog-34/front-1.89d9f49783d9.webp",
      "front-2": "img/residents/motion/dog-34/front-2.c39436553679.webp",
      "back-1": "img/residents/motion/dog-34/back-1.6df44dc7f62a.webp",
      "back-2": "img/residents/motion/dog-34/back-2.ebfb44563673.webp"
    },
    "34": {
      "work-1": "img/residents/motion/dog-35/work-1.f2e64777d7f4.webp",
      "work-2": "img/residents/motion/dog-35/work-2.a832ecb1d1b6.webp",
      "work-3": "img/residents/motion/dog-35/work-3.4cc241dc6605.webp",
      "walk-1": "img/residents/motion/dog-35/walk-1.73e96e4bf62b.webp",
      "walk-2": "img/residents/motion/dog-35/walk-2.f204892a145e.webp",
      "front-1": "img/residents/motion/dog-35/front-1.393770c97551.webp",
      "front-2": "img/residents/motion/dog-35/front-2.66e9738b6f9d.webp",
      "back-1": "img/residents/motion/dog-35/back-1.c53afe56906a.webp",
      "back-2": "img/residents/motion/dog-35/back-2.46d315f48df3.webp"
    },
    "35": {
      "work-1": "img/residents/motion/dog-36/work-1.b665b5d6648a.webp",
      "work-2": "img/residents/motion/dog-36/work-2.70054331384c.webp",
      "work-3": "img/residents/motion/dog-36/work-3.4544a161eba4.webp",
      "walk-1": "img/residents/motion/dog-36/walk-1.5b0b890d8cf6.webp",
      "walk-2": "img/residents/motion/dog-36/walk-2.2b0dc17a89e8.webp",
      "front-1": "img/residents/motion/dog-36/front-1.d2e631e5cbea.webp",
      "front-2": "img/residents/motion/dog-36/front-2.e8cf12a6d374.webp",
      "back-1": "img/residents/motion/dog-36/back-1.90bfb9668ddf.webp",
      "back-2": "img/residents/motion/dog-36/back-2.1a52a3d2aa41.webp"
    },
    "36": {
      "work-1": "img/residents/motion/dog-37/work-1.e913e72a9188.webp",
      "work-2": "img/residents/motion/dog-37/work-2.aebda2e98c3f.webp",
      "work-3": "img/residents/motion/dog-37/work-3.c1358939437d.webp",
      "walk-1": "img/residents/motion/dog-37/walk-1.2408146f92fc.webp",
      "walk-2": "img/residents/motion/dog-37/walk-2.36216bb406e5.webp",
      "front-1": "img/residents/motion/dog-37/front-1.82dd6d2ea907.webp",
      "front-2": "img/residents/motion/dog-37/front-2.a6cde72dd12f.webp",
      "back-1": "img/residents/motion/dog-37/back-1.d366732e2caf.webp",
      "back-2": "img/residents/motion/dog-37/back-2.44b0ca29a881.webp"
    },
    "37": {
      "work-1": "img/residents/motion/dog-38/work-1.8f3fcd9581ef.webp",
      "work-2": "img/residents/motion/dog-38/work-2.da0fe6b55688.webp",
      "work-3": "img/residents/motion/dog-38/work-3.f26023ed1bb9.webp",
      "walk-1": "img/residents/motion/dog-38/walk-1.a5238817a74b.webp",
      "walk-2": "img/residents/motion/dog-38/walk-2.95350aba8426.webp",
      "front-1": "img/residents/motion/dog-38/front-1.1d7bd4ecfa56.webp",
      "front-2": "img/residents/motion/dog-38/front-2.cf8debe27303.webp",
      "back-1": "img/residents/motion/dog-38/back-1.45f4e1097980.webp",
      "back-2": "img/residents/motion/dog-38/back-2.94abcec152db.webp"
    },
    "38": {
      "work-1": "img/residents/motion/dog-39/work-1.b22101315875.webp",
      "work-2": "img/residents/motion/dog-39/work-2.69d7f2900fdb.webp",
      "work-3": "img/residents/motion/dog-39/work-3.51260af75013.webp",
      "walk-1": "img/residents/motion/dog-39/walk-1.f000a44e509d.webp",
      "walk-2": "img/residents/motion/dog-39/walk-2.722456c0af35.webp",
      "front-1": "img/residents/motion/dog-39/front-1.cf734e4935d3.webp",
      "front-2": "img/residents/motion/dog-39/front-2.dacd7e029c54.webp",
      "back-1": "img/residents/motion/dog-39/back-1.cd2315d15b55.webp",
      "back-2": "img/residents/motion/dog-39/back-2.28e7add53539.webp"
    },
    "39": {
      "work-1": "img/residents/motion/dog-40/work-1.6af408eae8b5.webp",
      "work-2": "img/residents/motion/dog-40/work-2.65f44659c94a.webp",
      "work-3": "img/residents/motion/dog-40/work-3.cc1ff292a806.webp",
      "walk-1": "img/residents/motion/dog-40/walk-1.d6769ee84dfe.webp",
      "walk-2": "img/residents/motion/dog-40/walk-2.6aca9b40f283.webp",
      "front-1": "img/residents/motion/dog-40/front-1.ba59f7b84cbf.webp",
      "front-2": "img/residents/motion/dog-40/front-2.62f3439f76a3.webp",
      "back-1": "img/residents/motion/dog-40/back-1.f78e9cb1e58a.webp",
      "back-2": "img/residents/motion/dog-40/back-2.20332c20daae.webp"
    }
  }
};
export const FRAME_NAMES = ['work-1','work-2','work-3','walk-1','walk-2','front-1','front-2','back-1','back-2'];
export const frameImg = (kind,variant,name) => FRAME_FILES[kind]?.[variant]?.[name] ?? null;
