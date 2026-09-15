export interface InitialProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  show_price: boolean;
  category: 'ponquesitos' | 'otros_postres';
  image_url: string;
  active: boolean;
  order_index: number;
}

export const INITIAL_PRODUCTS: InitialProduct[] = [
  // 5 Ponquesitos
  {
    id: 'prod-pq-01',
    name: 'Ponquesito Red Velvet',
    description: 'Suave bizcocho aterciopelado con notas de cacao fino, relleno y coronado con nuestro frosting artesanal de queso crema.',
    price: '$2.00 c/u',
    show_price: true,
    category: 'ponquesitos',
    image_url: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 1
  },
  {
    id: 'prod-pq-02',
    name: 'Ponquesito Choco Intenso',
    description: 'Bizcocho húmedo de chocolate oscuro al 70%, relleno de fudge casero y bañado con ganache de chocolate belga.',
    price: '$2.00 c/u',
    show_price: true,
    category: 'ponquesitos',
    image_url: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 2
  },
  {
    id: 'prod-pq-03',
    name: 'Ponquesito Vainilla & Toffee',
    description: 'Bizcocho clásico de vainilla de Madagascar con corazón cremoso de caramelo toffee y crocante de mantequilla.',
    price: '$1.75 c/u',
    show_price: true,
    category: 'ponquesitos',
    image_url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 3
  },
  {
    id: 'prod-pq-04',
    name: 'Ponquesito Zanahoria & Nuez',
    description: 'Receta familiar con zanahoria fresca rallada, toques de canela y nueces pecanas tostadas, cubierto de glaseado cremoso.',
    price: '$2.25 c/u',
    show_price: true,
    category: 'ponquesitos',
    image_url: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 4
  },
  {
    id: 'prod-pq-05',
    name: 'Ponquesito Maracuyá Tropical',
    description: 'Sensación cítrica y fresca con curd concentrado de maracuyá / parchita y un suave merengue suizo dorado al soplete.',
    price: '$2.00 c/u',
    show_price: true,
    category: 'ponquesitos',
    image_url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 5
  },

  // 6 Otros Postres
  {
    id: 'prod-pst-01',
    name: 'Cheesecake Frutos Rojos',
    description: 'Cremoso pastel de queso horneado lentamente al estilo neoyorquino, con una generosa capa de coulis casero de fresas y moras.',
    price: '$18.00 entero',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 6
  },
  {
    id: 'prod-pst-02',
    name: 'Tres Leches Tradicional',
    description: 'Bizcochuelo sumamente esponjoso embebido en nuestra infusión especial de tres leches, culminado con merengue y canela molida.',
    price: '$15.00',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 7
  },
  {
    id: 'prod-pst-03',
    name: 'Marquesa de Nutella',
    description: 'Capas intercaladas de galletas María crocantes y crema sedosa de Nutella pura, espolvoreada con trocitos de avellanas.',
    price: '$16.00',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 8
  },
  {
    id: 'prod-pst-04',
    name: 'Pie de Limón Merengado',
    description: 'Base crocante de masa quebrada con mantequilla, relleno con crema ácida de limón natural y copetes de merengue italiano.',
    price: '$14.00',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 9
  },
  {
    id: 'prod-pst-05',
    name: 'Brownie Fudge & Nueces',
    description: 'Cuadros de brownie melcochudo con doble chocolate amargo y trozos de nueces tostadas. Deliciosos tibios.',
    price: '$3.50 c/u',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 10
  },
  {
    id: 'prod-pst-06',
    name: 'Tiramisú Clásico Italiano',
    description: 'Plantillas de bizcocho remojadas en café espresso y licor de café, combinadas con suave crema de queso mascarpone y cacao amargo.',
    price: '$16.00',
    show_price: true,
    category: 'otros_postres',
    image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
    active: true,
    order_index: 11
  }
];
