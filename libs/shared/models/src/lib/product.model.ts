/**
 * Product interface representing a financial product according to the requirements.
 * Defines the data structure for products used throughout the application.
 */
export interface Product {
  /**
   * Unique identifier for the product.
   * Must be between 3 and 10 characters long.
   */
  id: string;

  /**
   * Name of the product.
   * Must be between 5 and 100 characters long.
   */
  name: string;

  /**
   * Detailed description of the product.
   * Must be between 10 and 200 characters long.
   */
  description: string;

  /**
   * URL to the product logo image.
   */
  logo: string;

  /**
   * Release date of the product in ISO format (YYYY-MM-DD).
   * Must be today or a future date.
   */
  date_release: string;

  /**
   * Revision date of the product in ISO format (YYYY-MM-DD).
   * Must be exactly one year after the release date.
   */
  date_revision: string;
}

