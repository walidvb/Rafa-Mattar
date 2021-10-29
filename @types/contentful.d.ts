// THIS FILE IS AUTOMATICALLY GENERATED. DO NOT MODIFY IT.

import { Asset, Entry } from "contentful";
import { Document } from "@contentful/rich-text-types";

export interface IProjectFields {
  /** Title */
  title: string;

  /** Short Description */
  shortDescription?: Document | undefined;

  /** video url */
  videoUrl?: string | undefined;

  /** Home Image */
  homeImage: Asset;

  /** header image */
  headerImage: Asset;

  /** Body */
  body?: Document | undefined;

  /** Home Layout */
  homeLayout?: "two columns" | "full width" | "with mask" | undefined;
}

export interface IProject extends Entry<IProjectFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "project";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export interface ISiteSettingsFields {
  /** Couple Image */
  biographyImage: Asset;

  /** Intro Text */
  introText: Document;

  /** About */
  about?: Document | undefined;

  /** Valeria Bio */
  valeriaBio: Document;

  /** Antoine Bio */
  antoineBio: Document;
}

/** Container for all non-project related copy and assets */

export interface ISiteSettings extends Entry<ISiteSettingsFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "siteSettings";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}

export type CONTENT_TYPE = "project" | "siteSettings";

export type LOCALE_CODE = "en-US";

export type CONTENTFUL_DEFAULT_LOCALE_CODE = "en-US";
