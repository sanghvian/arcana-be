import algoliasearch from 'algoliasearch';

const algoliaAppId = 'your_algolia_app_id';
const algoliaApiKey = 'your_algolia_api_key';
const indexName = 'your_index_name';

const client = algoliasearch(algoliaAppId, algoliaApiKey);
const index = client.initIndex(indexName);

const companyData = [
    {
        "name": "Apple Inc.",
        "symbol": "AAPL",
        "sector": "Technology",
        "lastDiv": 0.92,
        "range": "124.17-176.15",
        "beta": 1.297088,
        "volAvg": 65275362,
        "industry": "Consumer Electronics",
        "website": "https://www.apple.com",
        "ceo": "Mr. Timothy D. Cook",
        "image": "https://financialmodelingprep.com/image-stock/AAPL.png",
        "description": "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. In addition, the company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; ."
    }
];

async function addToAlgolia() {
    const algoliaObjects = companyData.map((company) => {
        return {
            objectID: company.symbol,
            name: company.name,
            symbol: company.symbol,
            sector: company.sector,
            industry: company.industry,
            ceo: company.ceo,
            description: company.description,
        };
    });

    try {
        const { objectIDs } = await index.saveObjects(algoliaObjects);
        console.log(`Successfully added objects with objectIDs: ${objectIDs}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

addToAlgolia();
