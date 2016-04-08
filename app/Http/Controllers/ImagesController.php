<?php

namespace App\Http\Controllers;

use App\Http\Requests;
use App\Image;
use Illuminate\Http\Request;

class ImagesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $section = $request->get('section') ?: 'sort';
        $images = Image::orderBy('offset','asc')
            ->orderBy('created_at', 'desc')
            ->get();
        return view('images.index', compact('images'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if ( !$request->hasFile('file') )
        {
            abort(400, 'file required');
        }

        $path = Image::store($request->file('file'));
        if ($path)
        {
            $image = Image::create([
                'url' => $path,
                'tn_url' => $path
            ]);
            if ($image)
            {
                return response()->json($image, 201);
            }
        }
        else
        {
            return abort(500, 'could not save image');
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
    }

    public function reorder(Request $request)
    {
        $order = $request->get('order');

        $response = [];

        foreach ($order as $offset => $data)
        {
            $image_id = substr($data, 6);
            $image = Image::find($image_id);
            $image->offset = $offset;
            $image->save();

            $response[] = compact('image_id','offset');
        }

        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($image = Image::find($id))
        {
            if ($image->delete())
            {
                return response()->json(['image_id' => $id], 200);
            }
        }
        else
        {
            return abort(404, 'could not find image');
        }
        return abort(400, 'could not delete image');
    }
}
