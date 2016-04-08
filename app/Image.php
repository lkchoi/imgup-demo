<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

class Image extends Model
{
    protected $fillable = [
        'title',
        'description',
        'offset',
        'url',
        'tn_url'
    ];

    public $dates = [
        'deleted_at'
    ];

    public static function store(UploadedFile $file)
    {
        $ext = $file->guessClientExtension();
        $filename = str_random(45);
        $path = "/s3/{$filename}.{$ext}";
        $file = $file->move(
            public_path('s3'),
            "{$filename}.{$ext}"
        );
        return $path;
    }
}
