import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import productCategory from '../helpers/productCategory';
import VerticalCard from '../components/VerticalCard';
import SummaryApi from '../common';

const CategoryProduct = () => {
    const params = useParams();
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListinArray = urlSearch.getAll('category');

    const urlCategoryListObject = {};
    urlCategoryListinArray.forEach(el => {
        urlCategoryListObject[el] = true;
    });

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const response = await fetch(SummaryApi.filterProduct.url, {
            method: SummaryApi.filterProduct.method,
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                category: filterCategoryList,
            }),
        });

        const dataResponse = await response.json();
        setData(dataResponse?.data || []);
        setLoading(false);
    };

    const handleSelectCategory = (e) => {
        const { name, value, checked } = e.target;

        setSelectCategory((prev) => ({
            ...prev,
            [value]: checked,
        }));
    };

    useEffect(() => {
        fetchData();
    }, [filterCategoryList]);

    useEffect(() => {
        const arrayOfCategory = Object.keys(selectCategory)
            .map(categoryKeyName => {
                if (selectCategory[categoryKeyName]) {
                    return categoryKeyName;
                }
                return null;
            })
            .filter(el => el);

        setFilterCategoryList(arrayOfCategory);

        const urlFormat = arrayOfCategory.map((el, index) => {
            if (arrayOfCategory.length - 1 === index) {
                return `category-${el}`;
            }
            return `category-${el}&&`;
        });

        navigate('/product-category?' + urlFormat.join(''));
    }, [selectCategory]);

    const handleOnChangeSortBy = (e) => {
        const { value } = e.target;

        setSortBy(value);

        if (value === 'asc') {
            setData(prev => [...prev].sort((a, b) => a.sellingPrice - b.sellingPrice));
        }

        if (value === 'dsc') {
            setData(prev => [...prev].sort((a, b) => b.sellingPrice - a.sellingPrice));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[200px,1fr]">
                {/* Sidebar for larger screens */}
                <div className="hidden lg:block bg-white p-2 lg:min-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none">
                    <div>
                        <h3 className="text-xl uppercase font-medium text-black border-b pb-1 border-black">
                            SẮP XẾP THEO
                        </h3>
                        <form className="text-base flex flex-col gap-2 py-2 font-semibold">
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    checked={sortBy === 'asc'}
                                    onChange={handleOnChangeSortBy}
                                    value={'asc'}
                                />
                                <label>Giá - Thấp đến Cao</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    name="sortBy"
                                    checked={sortBy === 'dsc'}
                                    onChange={handleOnChangeSortBy}
                                    value={'dsc'}
                                />
                                <label>Giá - Cao đến Thấp</label>
                            </div>
                        </form>
                    </div>
                    <div>
                        <h3 className="text-xl uppercase font-medium text-black border-b pb-1 border-black">
                            DANH MỤC
                        </h3>
                        <form className="text-sm flex flex-col gap-2 py-2">
                            {productCategory.map((categoryName, index) => (
                                <div key={index} className="flex items-center gap-3 text-base font-semibold">
                                    <input
                                        type="checkbox"
                                        name={'category'}
                                        checked={selectCategory[categoryName?.value]}
                                        value={categoryName?.value}
                                        id={categoryName?.value}
                                        onChange={handleSelectCategory}
                                    />
                                    <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                </div>
                            ))}
                        </form>
                    </div>
                </div>
                {/* Dropdown for smaller screens */}
                <div className="lg:hidden">
                    <button
                        className="bg-[#cc0000] text-white p-2 rounded"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        {dropdownOpen ? 'Đóng bộ lọc' : 'Mở bộ lọc'}
                    </button>
                    {dropdownOpen && (
                        <div className="bg-white p-2 overflow-y-auto scrollbar-none">
                            <div>
                                <h3 className="text-xl uppercase font-medium text-black border-b pb-1 border-black">
                                    SẮP XẾP THEO
                                </h3>
                                <form className="text-base flex flex-col gap-2 py-2 font-semibold">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="sortBy"
                                            checked={sortBy === 'asc'}
                                            onChange={handleOnChangeSortBy}
                                            value={'asc'}
                                        />
                                        <label>Giá - Thấp đến Cao</label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="sortBy"
                                            checked={sortBy === 'dsc'}
                                            onChange={handleOnChangeSortBy}
                                            value={'dsc'}
                                        />
                                        <label>Giá - Cao đến Thấp</label>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <h3 className="text-xl uppercase font-medium text-black border-b pb-1 border-black">
                                    DANH MỤC
                                </h3>
                                <form className="text-sm flex flex-col gap-2 py-2">
                                    {productCategory.map((categoryName, index) => (
                                        <div key={index} className="flex items-center gap-3 text-base font-semibold">
                                            <input
                                                type="checkbox"
                                                name={'category'}
                                                checked={selectCategory[categoryName?.value]}
                                                value={categoryName?.value}
                                                id={categoryName?.value}
                                                onChange={handleSelectCategory}
                                            />
                                            <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                                        </div>
                                    ))}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                <div className="px-4">
                    <p className="font-medium text-slate-800 text-lg my-2">
                        Kết quả tìm kiếm : {data.length}
                    </p>
                    <div className="min-h-[calc(100vh-120px)] overflow-y-auto scrollbar-none max-h-[calc(100vh-120px)]">
                        {data.length !== 0 && !loading && (
                            <VerticalCard data={data} loading={loading} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryProduct;
