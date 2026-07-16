import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAbout extends Struct.ComponentSchema {
  collectionName: 'components_shared_abouts';
  info: {
    displayName: 'About';
    icon: 'user';
  };
  attributes: {
    bio: Schema.Attribute.Text;
    picture: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedMediaItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_items';
  info: {
    displayName: 'Media Item';
    icon: 'picture';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    published: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['image', 'video']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'image'>;
    videoUrl: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedOg extends Struct.ComponentSchema {
  collectionName: 'components_shared_ogs';
  info: {
    displayName: 'OG';
    icon: 'globe';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.about': SharedAbout;
      'shared.media-item': SharedMediaItem;
      'shared.og': SharedOg;
    }
  }
}
